'use strict';

const {Task, TaskQueue, Scheduler} = require('./scheduler')
const Analyzer = require('../analyzer/fundanalyzer');

// Page: http://overseas.1234567.com.cn/FundList

// Crawl url
const hkRankUri = "http://overseas.1234567.com.cn/overseasapi/OpenApiHander.ashx?api=HKFDApi&m=MethodFundList&action=1&pageindex=0&pagesize=50&dy=1&date1=2020-02-23&date2=2021-02-23&sortfield=W&sorttype=-1&isbuy=0&callback=jQuery18307391053966150833_1614082770915&_=%s"

const headers = {
    'Host': 'overseas.1234567.com.cn',
    'Proxy-Connection': 'keep-alive',
    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate',
    'Referer': 'http://overseas.1234567.com.cn/FundList',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'X-Requested-With': 'XMLHttpRequest'
}

 function parseHKRank(data) {
    const jsonObj = parseJsonObject(data);
    const fundItems = [];
    for (const item of jsonObj['Data']) {
        let fundItem = {};
        fundItem['code'] = item['FCODE'];
        fundItem['name'] = item['SHORTNAME'];
        fundItem['day'] = item['JZRQ'];
        fundItem['unitNetWorth'] = item['NAV'];
        fundItem['dayOfGrowth'] = item['D'];
        fundItem['recent1Week'] = item['W'];
        fundItem['recent1Month'] = item['M'];
        fundItem['recent3Month'] = item['Q'];
        fundItem['recent6Month'] = item['HY'];
        fundItem['recent1Year'] = item['Y'];
        fundItem['recent2Year'] = item['TWY'];
        fundItem['recent3Year'] = item['TRY'];
        fundItem['fromThisYear'] = item['SY'];
        fundItem['fromBuild'] = item['SE'];
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

exports.start = function start() {
    var task = new Task('hk', hkRankUri, headers)

    var queue = new TaskQueue([task])

    var scheduler = new Scheduler(queue, parseHKRank, Analyzer.analyze)
    scheduler.start()
}



