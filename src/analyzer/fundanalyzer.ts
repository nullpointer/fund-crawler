export interface Fund {
    recent1Week?: number;
    recent1Month?: number;
    recent3Month?: number;
    recent6Month?: number;
    recent1Year?: number;
    recent2Year?: number;
    recent3Year?: number;
    fromBuild?: number;
    rank1Week?: number;
    rank1Month?: number;
    rank3Month?: number;
    rank6Month?: number;
    rank1Year?: number;
    rank2Year?: number;
    rank3Year?: number;
    rankFromBuild?: number;
    totalFunds?: number;
}

export function analyze(funds: Fund[]): Fund[] {
    let recent1Week: Fund[] = funds.sort(sortFundByRecent1Week);
    let recent1Month: Fund[] = funds.sort(sortFundByRecent1Month).slice(0, funds.length / 4);
    let recent3Month: Fund[] = funds.sort(sortFundByRecent3Month).slice(0, funds.length / 4);
    let recent6Month: Fund[] = funds.sort(sortFundByRecent6Month).slice(0, funds.length / 4);
    let recent1Year: Fund[] = funds.sort(sortFundByRecent1Year).slice(0, funds.length / 5);
    let recent2Year: Fund[] = funds.sort(sortFundByRecent2Year).slice(0, funds.length / 5);
    let recent3Year: Fund[] = funds.sort(sortFundByRecent3Year).slice(0, funds.length / 5);
    let fromBuild: Fund[] = funds.sort(sortFundByFromBuild).slice(0, funds.length / 4);

    let intersect: Fund[] = recent1Month.filter((fund: Fund) => recent3Month.indexOf(fund) >= 0)
        .filter((fund: Fund) => recent6Month.indexOf(fund) >= 0)
        .filter((fund: Fund) => recent1Year.indexOf(fund) >= 0)
        .filter((fund: Fund) => recent2Year.indexOf(fund) >= 0)
        .filter((fund: Fund) => recent3Year.indexOf(fund) >= 0)
        .filter((fund: Fund) => fromBuild.indexOf(fund) >= 0);

    intersect.forEach((fund: Fund) => {
        const rank1Week: number = recent1Week.indexOf(fund) + 1;
        const rank1Month: number = recent1Month.indexOf(fund) + 1;
        const rank3Month: number = recent3Month.indexOf(fund) + 1;
        const rank6Month: number = recent6Month.indexOf(fund) + 1;
        const rank1Year: number = recent1Year.indexOf(fund) + 1;
        const rank2Year: number = recent2Year.indexOf(fund) + 1;
        const rank3Year: number = recent3Year.indexOf(fund) + 1;
        const rankFromBuild: number = fromBuild.indexOf(fund) + 1;

        fund.rank1Week = rank1Week;
        fund.rank1Month = rank1Month;
        fund.rank3Month = rank3Month;
        fund.rank6Month = rank6Month;
        fund.rank1Year = rank1Year;
        fund.rank2Year = rank2Year;
        fund.rank3Year = rank3Year;
        fund.rankFromBuild = rankFromBuild;
        fund.totalFunds = funds.length;
    });

    return intersect;
}

function sortFundByRecent1Week(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent1Week');
}

function sortFundByRecent1Month(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent1Month');
}

function sortFundByRecent3Month(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent3Month');
}

function sortFundByRecent6Month(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent6Month');
}

function sortFundByRecent1Year(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent1Year');
}

function sortFundByRecent2Year(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent2Year');
}

function sortFundByRecent3Year(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'recent3Year');
}

function sortFundByFromBuild(fund1: Fund, fund2: Fund): number {
    return sortFund(fund1, fund2, 'fromBuild');
}

function sortFund(fund1: Fund, fund2: Fund, key: keyof Fund): number {
    const result: number = parseFloat(fund2[key] || '-32678') - parseFloat(fund1[key] || '-32678');
    return result;
}