'use strict';

const {Task, TaskQueue, Scheduler} = require('./scheduler')
const Analyzer = require('../analyzer/fundanalyzer');
const Util = require('util');

// Page: http://fund.eastmoney.com/data/fundranking.html

// Crawl url
const rankUri = "https://fundapi.eastmoney.com/fundtradenew.aspx?ft=%s&pi=1&pn=10000"

function parseRank(data) {
    const jsonObj = parseJsonObject(data);

    const fundItems = [];
    for (const item of jsonObj['datas']) {
        let fundItem = {};
        const fundArray = item.split('|');
        fundItem['code'] = fundArray[0];
        fundItem['name'] = fundArray[1];
        fundItem['day'] = fundArray[3];
        fundItem['unitNetWorth'] = fundArray[4];
        fundItem['dayOfGrowth'] = fundArray[5];
        fundItem['recent1Week'] = fundArray[6];
        fundItem['recent1Month'] = fundArray[7];
        fundItem['recent3Month'] = fundArray[8];
        fundItem['recent6Month'] = fundArray[9];
        fundItem['recent1Year'] = fundArray[10];
        fundItem['recent2Year'] = fundArray[11];
        fundItem['recent3Year'] = fundArray[12];
        fundItem['fromThisYear'] = fundArray[13];
        fundItem['fromBuild'] = fundArray[14];
        fundItem['serviceCharge'] = fundArray[20];
        fundItems.push(fundItem);
    }
    return fundItems;
}

function parseJsonObject(data) {
    const start = data.indexOf('{');
    const end = data.lastIndexOf('}') + 1;
    const jsonStr = data.slice(start, end);
    const jsonObj = eval('(' + jsonStr + ')');

    return jsonObj 
}

const items = {
    'gp': 'gupiao',    // 股票型
    'zs': 'zhishu',    // 指数型
    'hh': 'hunhe',     // 混合型
    'zq': 'zhaiquan',  // 债券型
    'qdii': 'qdii',    // QDII
    'fof': 'fof'       // FOF
}

exports.start = function start() {
    var queue = new TaskQueue()
    for (let key in items) {
        var uri = Util.format(rankUri, key)
        var task = new Task(items[key], uri)
        queue.addTask(task)
    }
    var scheduler = new Scheduler(queue, parseRank, Analyzer.analyze)
    scheduler.start()
}



