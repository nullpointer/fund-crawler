'use strict'

const DateFormat = require('dateformat');
const Crawler = require('crawler')
const DB = require('../db')
const Log = require('../log')

class Scheduler {
    constructor(taskQueue, parser = null) {
        this.tryTimes = 0

        var self = this
        self.taskQueue = taskQueue

        self.crawler = new Crawler({
            rateLimit: 1000, // between two tasks, minimum time gap is 1000 (ms)
            maxConnections: 1,
            method: 'GET',
            jQuery: true,
            callback: function (error, res, done) {
                if (error) {
                    Log.error(error)
                    self.schedule(res.options.task)

                } else {
                    Log.success('Succeed to crawl ' + res.options.uri)

                    const filepath = res.options.task.storePath
                    if (parser instanceof Function) {
                        const result = parser(res.body)
                        DB.write(filepath, result)
                    }
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
            Log.info('Schedule REQ task ' + task.uri + ', try times = ' + task.tryTimes)
            this.crawler.queue({ uri: task.uri, headers: task.headers, task: task })
        }
    }
}

class TaskQueue {
    constructor(tasks = []) {
        this.tasks = tasks
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

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.3.4000 Chrome/30.0.1599.101 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36'
]

class Task {

    constructor(key, uri, headers = {}) {
        // init store path with key
        var now = DateFormat(new Date(), 'yyyy/mm/dd')
        this.storePath = now + '/' + key + '.json'
        this.recommendStorePath = now + '/' + key + '.recommend.json'

        this.uri = uri

        // init headers with random userAgent
        let userAgent = userAgents[Task.getRandomInt(userAgents.length)]
        headers['User-Agent'] = userAgent
        this.headers = headers

        this.tryTimes = 0
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}


module.exports = { Task, TaskQueue, Scheduler }