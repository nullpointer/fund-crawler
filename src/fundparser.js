'use strict';

exports.parse = function parse(data) {
    const start = data.indexOf('{');
    const end = data.indexOf('}') + 1;
    const jsonStr = data.slice(start, end);
    const jsonObj = eval('(' + jsonStr + ')');

    const fundItems = [];
    for (const item of jsonObj['datas']) {
        let fundItem = {};
        const fundArray = item.split(',');
        fundItem['code'] = fundArray[0];
        fundItem['name'] = fundArray[1];
        fundItem['day'] = fundArray[3];
        fundItem['unitNetWorth'] = fundArray[4];
        fundItem['dayOfGrowth'] = fundArray[6];
        fundItem['recent1Week'] = fundArray[7];
        fundItem['recent1Month'] = fundArray[8];
        fundItem['recent3Month'] = fundArray[9];
        fundItem['recent6Month'] = fundArray[10];
        fundItem['recent1Year'] = fundArray[11];
        fundItem['recent2Year'] = fundArray[12];
        fundItem['recent3Year'] = fundArray[13];
        fundItem['fromThisYear'] = fundArray[14];
        fundItem['fromBuild'] = fundArray[15];
        fundItem['serviceCharge'] = fundArray[20];
        fundItems.push(fundItem);
    }
    return fundItems;
}
