'use strict';

const DateFormat = require('dateformat');
const Util = require('util');
const Crawler = require('crawler');

const DB = require('../db');
const FundParser = require('../analyzer/fundparser');
const Analyzer = require('../analyzer/fundanalyzer');
const Log = require('../log');
const { subtract } = require('lodash');

// Crawl url
const rankUri = "https://fundapi.eastmoney.com/fundtradenew.aspx?ft=%s&pi=1&pn=10000"
const headers = [
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36' },
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER' },
    { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)' },
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0' },
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.3.4000 Chrome/30.0.1599.101 Safari/537.36' },
    { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36' }
]

class Task {

    constructor(type) {
        this.type = type
        this.uri = Util.format(rankUri, type)
        this.headers = headers[Task.getRandomInt(headers.length)]

        // Init store path
        var now = DateFormat(new Date(), 'yyyy/mm/dd')
        this.storePath = now + '/' + Task._fixType(type) + '.json'
        this.recommendStorePath = now + '/' + Task._fixType(type) + '.recommend.json'

        this.tryTimes = 0
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static _fixType(type) {
        switch(type) {
            case 'gp': return 'gupiao'
            case 'zq': return 'zhaiquan'
            case 'zs': return 'zhishu'
            case 'hh': return 'hunhe'
            default: return type
        }
    }
}

class TaskQueue {
    constructor() {
        this.tasks = []
    }

    static from(fundTypes) {
        var taskQueue = new TaskQueue()
        fundTypes.forEach(fundType => {
            taskQueue.addTask(new Task(fundType))
        })

        return taskQueue
    }

    list() {
        return this.tasks;
    }

    addTask(task) {
        this.tasks.push(task)
    }

    popTask() {
        return this.tasks.pop()
    }

    hasNext() {
        return this.tasks.length > 0
    }
}

class Scheduler {
    constructor() {
        this.tryTimes = 0

        var self = this
        self.taskQueue = TaskQueue.from([
            'gp',   // 股票型
            'hh',   // 混合型
            'zq',   // 债券型
            'zs',   // 指数型
            'qdii', // QDII
            'fof'   // FOF
        ])

        self.crawler = new Crawler({
            rateLimit: 1000, // between two tasks, minimum time gap is 1000 (ms)
            maxConnections: 1,
            callback : function (error, res, done) {
                if (error) {
                    Log.error(error)
                    self.schedule(res.options.task)

                } else {
                    Log.success('Succeed to crawl ' + res.options.uri)

                    const filepath = res.options.task.storePath;
                    const funds = FundParser.parseRank(res.body);
                    DB.write(filepath, funds)
        
                    const recommendPath = res.options.task.recommendStorePath;
                    const recommendFunds = Analyzer.analyze(funds);
                    DB.write(recommendPath, recommendFunds)
                }

                done()
            }
        })
    }

    start() {
        this.taskQueue.list().forEach(task => {
            this.schedule(task)
        })
    }

    schedule(task) {
        if (!task.success && task.tryTimes < 3) {
            task.tryTimes++
            Log.info('Schedule task ' + task.uri + ', try times = ' + task.tryTimes)
            this.crawler.queue({ uri: task.uri, headers: task.headers, task: task })
        }
    }
}

exports.start = function start() {
    new Scheduler().start()
}



