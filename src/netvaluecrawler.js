'use strict';

const Crawler = require('./crawler');
const DB = require('./db');
const FundParser = require('./fundparser');
const Util = require('util');

const c = new Crawler({
    // maxConnections : 10,
    rateLimit: 1000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const netvalues = FundParser.parseNetValue(res.body);
            const filepath = 'funds/' + res.options['code'] + '.json';
            DB.write({netvalues}, filepath);

            pause(netvalues.length << 2); // Slow down
        }
        done();
    }
});

function queueOneCode(code) {
    const uri = "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=%s&page=1&per=%s"
    c.queue({
        url: Util.format(uri, code, 1),
        callback: function (error, res, done) {
            if (error) {
                console.error(error);
            } else {
                // Get records
                const records = FundParser.parseNumOfNetValueRecord(res.body);
                if (records && records > 0) {
                    // Get all net value
                    c.queue({
                        url: Util.format(uri, code, records),
                        code: code
                    });
                }
            }
            done();
        }
    });

    console.info(code + " queued.");
}

function pause(millis) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while (curDate - date < millis);
}

exports.start = function start() {
    DB.read('allcodes.json').then(function (res) {
        const jsonObj = eval('(' + res + ')');

        const date = new Date().getUTCDate();
        for (let code of jsonObj[0]['codes']) {
            // Crawler day by day
            if (code % 31 + 1 === date) {
                queueOneCode(code);
            }
        }
    });
}
