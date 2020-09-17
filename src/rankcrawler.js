'use strict';

const Crawler = require('./crawler');
const DB = require('./db');
const FundParser = require('./fundparser');
const DateFormat = require('dateformat');
const Util = require('util');
const Analyzer = require('./fundanalyzer');

const c = new Crawler({
    // maxConnections : 10,
    rateLimit: 1000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const funds = FundParser.parseRank(res.body);
            const filepath = DateFormat(new Date(), 'yyyy/mm/dd') + '/' + res.options['type'] + '.json';
            DB.write(funds, filepath);

            const recommendFunds = Analyzer.analyze(funds);
            const recommendPath = DateFormat(new Date(), 'yyyy/mm/dd') + '/' + res.options['type'] + '.recommend.json';
            DB.write(recommendFunds, recommendPath);

            if (res.options['type'] === 'all') {
                writeAllFundCodes(funds);
            }
        }
        done();
    }
});

function pause(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}

function writeAllFundCodes(funds) {
    const codes = [];
    for (let fund of funds) {
        codes.push(fund['code']);
    }

    DB.write({codes}, 'allcodes.json');
    pause(codes.length);
}

exports.start = function start() {
    const rankUri = "https://fundapi.eastmoney.com/fundtradenew.aspx?ft=%s&pi=1&pn=10000"

    const user_agent_list = [
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.3.4000 Chrome/30.0.1599.101 Safari/537.36',
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36'
    ]

    const headers = [
        {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"},       
    ]

    // c.queue({ uri: Util.format(rankUri, 'all'), type: 'all' }); // 全部
    c.queue({ uri: Util.format(rankUri, 'gp'), type: 'gupiao', headers: headers[0] }); // 股票型
    c.queue({ uri: Util.format(rankUri, 'hh'), type: 'hunhe' }); // 混合型
    c.queue({ uri: Util.format(rankUri, 'zq'), type: 'zhaiquan' }); // 债券型
    c.queue({ uri: Util.format(rankUri, 'zs'), type: 'zhishu' }); // 指数型
    c.queue({ uri: Util.format(rankUri, 'qdii'), type: 'qdii' }); // QDII
    // c.queue({ uri: Util.format(rankUri, 'lof'), type: 'lof' }); // LOF
    c.queue({ uri: Util.format(rankUri, 'fof'), type: 'fof' }); // FOF
}


