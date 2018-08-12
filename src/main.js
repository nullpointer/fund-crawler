
const Crawler = require('./crawler');
const DB = require('./db');
const FundParser = require('./fundparser');

const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const funds = FundParser.parse(res.body);
            DB.write(funds);
        }
        done();
    }
});


// Queue just one URL, with default callback
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'all'
});