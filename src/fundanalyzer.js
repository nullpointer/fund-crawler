'use strict';

exports.analyze = function(funds) {
    let recent3Month = funds.sort(sortFundByRecent3Month);
    recent3Month = recent3Month.slice(0, recent3Month.length / 3);

    let recent6Month = funds.sort(sortFundByRecent6Month);
    recent6Month = recent6Month.slice(0, recent6Month.length / 3);

    let recent1Year = funds.sort(sortFundByRecent1Year);
    recent1Year = recent1Year.slice(0, recent1Year.length / 4);

    let recent2Year = funds.sort(sortFundByRecent2Year);
    recent2Year = recent2Year.slice(0, recent2Year.length / 4);

    let recent3Year = funds.sort(sortFundByRecent3Year);
    recent3Year = recent3Year.slice(0, recent3Year.length / 4);

    let fromBuild = funds.sort(sortFundByFromBuild);
    fromBuild = fromBuild.slice(0, fromBuild.length / 4);


    let intersect = recent3Month.filter(function (fund) {
        return recent6Month.indexOf(fund) >= 0;
    });

    intersect = intersect.filter(function (fund) {
        return recent1Year.indexOf(fund) >= 0;
    });

    intersect = intersect.filter(function (fund) {
        return recent2Year.indexOf(fund) >= 0;
    });

    intersect = intersect.filter(function (fund) {
        return recent3Year.indexOf(fund) >= 0;
    });

    intersect = intersect.filter(function (fund) {
        return fromBuild.indexOf(fund) >= 0;
    });

    intersect.forEach(fund => {
        const rank3Month = recent3Month.indexOf(fund);
        const rank6Month = recent6Month.indexOf(fund);
        const rank1Year = recent1Year.indexOf(fund);
        const rank2Year = recent2Year.indexOf(fund);
        const rank3Year = recent3Year.indexOf(fund);
        const rankFromBuild = fromBuild.indexOf(fund);

        const total = funds.length;
        fund['rank3Month'] = rank3Month + '/' + total;
        fund['rank6Month'] = rank6Month + '/' + total;
        fund['rank1Year'] = rank1Year + '/' + total;
        fund['rank2Year'] = rank2Year + '/' + total;
        fund['rank3Year'] = rank3Year + '/' + total;
        fund['rankFromBuild'] = rankFromBuild + '/' + total;
    });

    return intersect;
}

function sortFundByRecent3Month(fund1, fund2) {
    return sortFund(fund1, fund2, 'recent3Month');
}

function sortFundByRecent6Month(fund1, fund2) {
    return sortFund(fund1, fund2, 'recent6Month');
}

function sortFundByRecent1Year(fund1, fund2) {
    return sortFund(fund1, fund2, 'recent1Year');
}

function sortFundByRecent2Year(fund1, fund2) {
    return sortFund(fund1, fund2, 'recent2Year');
}

function sortFundByRecent3Year(fund1, fund2) {
    return sortFund(fund1, fund2, 'recent3Year');
}

function sortFundByFromBuild(fund1, fund2) {
    return sortFund(fund1, fund2, 'fromBuild');
}


function sortFund(fund1, fund2, key) {
    const result = parseFloat(fund2[key] || -32678) - parseFloat(fund1[key] || -32678) ;
    return result;
}
