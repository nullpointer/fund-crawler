'use strict';

const {Task, TaskQueue, Scheduler} = require('./scheduler')
const Util = require('util');

// Crawl url
const themeUri = "http://api.fund.eastmoney.com/ztjj/GetZTJJList?callback=jQuery183034382836069271905_1613810977162&tt=0&dt=syl&st=%s&_=%s"

const headers = {
    'Host': 'api.fund.eastmoney.com',
    'Proxy-Connection': 'keep-alive',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Referer': 'http://fund.eastmoney.com/',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
}

function parseFundTheme(data) {
    const jsonObj = parseJsonObject(data);
    return jsonObj['Data'];
}

function parseJsonObject(data) {
    const start = data.indexOf('{');
    const end = data.lastIndexOf('}') + 1;
    const jsonStr = data.slice(start, end);
    const jsonObj = eval('(' + jsonStr + ')');

    return jsonObj 
}

exports.start = function start() {
    var uri = Util.format(themeUri, 'SYL_W', Date.now())
    var task = new Task('theme', uri, headers)

    var queue = new TaskQueue([task])

    var scheduler = new Scheduler(queue, parseFundTheme)
    scheduler.start()
}



