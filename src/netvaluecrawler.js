'use strict';

const Crawler = require('./crawler');
const DB = require('./db');
const Util = require('util');


const c = new Crawler({
    // maxConnections : 10,
    rateLimit: 1000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            console.log(res.body);
        }
        done();
    }
});

exports.start = function start() {
    const uri = 'http://fundf10.eastmoney.com/jjjz_%s.html'
    DB.read('allcodes.json').then(function (res) {
        const jsonObj = eval('(' + res + ')');
        let url;
        for (let code of jsonObj[0]['codes']) {
            url = Util.format(uri, code);
        }

        console.log(url);
        c.queue(url);
    });
}