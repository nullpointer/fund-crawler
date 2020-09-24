'use strict';

const cheerio = require('cheerio')

exports.parseRank = function(data) {
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


exports.parseNetValue = function(data) {
    const jsonObj = parseJsonObject(data);

    const $ = cheerio.load(jsonObj['content']);
    const $tbody = $('tbody');
    const $alltr = $tbody.find('tr');
    const netvalues = [];
    $alltr.each(function() {
        const netvalue = [];
        $(this).find('td').each(function() {
            netvalue.push($(this).text());
        })
        netvalues.push(netvalue);
    })
    return netvalues;
}

exports.parseNumOfNetValueRecord = function(data) {
    const jsonObj = parseJsonObject(data);
    return jsonObj['records'];
}


function parseJsonObject(data) {
    const start = data.indexOf('{');
    const end = data.indexOf('}') + 1;
    const jsonStr = data.slice(start, end);
    const jsonObj = eval('(' + jsonStr + ')');

    return jsonObj
}