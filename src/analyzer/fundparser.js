'use strict';

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

exports.parseHKRank = function(data) {
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

exports.parseFundTheme = function(data) {
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