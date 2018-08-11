
const Crawler = require('./crawler');
const GithubDB = require('./githubdb');
const DateFormat = require('dateformat');

function parse(data) {
    const start = data.indexOf('{');
    const end = data.indexOf('}') + 1;
    const jsonStr = data.slice(start, end);
    const jsonObj = eval('(' + jsonStr + ')');

    const fundItems = [];
    for (const key in jsonObj) {
        for (const item of jsonObj[key]) {
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
            fundItem['serviceCharge'] = fundArray[18];
            fundItem['upEnoughAmount'] = fundArray[24];
            fundItems.push(fundItem);
        }
    }

    return fundItems;

}

function writeGithubdb(funds) {
    const filepath = DateFormat(new Date(), 'yyyy-mm-dd') + '.json';

    const options = {
        owner: 'nullpointer',
        repo: 'fund-data',
        path: filepath
    };

    const githubDB = new GithubDB(options);
    githubDB.auth(reverse(process.env.TOKEN));
    githubDB.connectToRepo();
    githubDB.createFile().then(function () {
        githubDB.save(funds);
    }).catch(function () {
        githubDB.save(funds);
    });;
}

function reverse(str) {
    return str.split("").reverse().join("")
}

const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if (error) {
            console.error(error);
        } else {
            const funds = parse(res.body);
            writeGithubdb(funds);
        }
        done();
    }
});


// Queue just one URL, with default callback
c.queue({
    uri: 'https://fundapi.eastmoney.com/fundtradenew.aspx',
    ft: 'pg',
    sc: '1',
    st: 'desc',
    pi: '2',
    pn: '3000'
});