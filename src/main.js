
const Crawler = require('./crawler');
const DB = require('./db');
const FundParser = require('./fundparser');
const DateFormat = require('dateformat');

const c = new Crawler({
    // maxConnections : 10,
    rateLimit: 1000,
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const funds = FundParser.parse(res.body);
            const filepath = DateFormat(new Date(), 'yyyy/mm/dd') + '/' + res.options['type'] + '.json';
            DB.write(funds, filepath);
        }
        done();
    }
});

// 全部
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=all&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'all'
});

// 股票型
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=gp&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'gupiao'
});

// 混合型
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=hh&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'hunhe'
});

// 债券型
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zq&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'zhaiquan'
});

// 指数型
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=zs&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'zhishu'
});

// QDII
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=qdii&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'qdii'
});

// LOF
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=lof&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'lof'
});

// FOF
c.queue({
    uri: 'http://fund.eastmoney.com/data/rankhandler.aspx?op=ph&dt=kf&ft=fof&rs=&gs=0&sc=zzf&st=desc&pi=1&pn=10000&dx=1',
    type: 'fof'
});
