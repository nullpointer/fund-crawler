
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
    uri: 'https://fundapi.eastmoney.com/fundtradenew.aspx?ft=pg&sc=1&st=desc&pi=1&pn=3000',
    ft: 'pg'
});