export interface FundItem {
    code: string;
    name: string;
    day: string;
    unitNetWorth: string;
    dayOfGrowth: string;
    recent1Week: string;
    recent1Month: string;
    recent3Month: string;
    recent6Month: string;
    recent1Year: string;
    recent2Year: string;
    recent3Year: string;
    fromThisYear: string;
    fromBuild: string;
    serviceCharge?: string;
}

export interface HKFundItem {
    FCODE: string;
    SHORTNAME: string;
    JZRQ: string;
    NAV: string;
    D: string;
    W: string;
    M: string;
    Q: string;
    HY: string;
    Y: string;
    TWY: string;
    TRY: string;
    SY: string;
    SE: string;
}

export function parseRank(data: string): FundItem[] {
    const jsonObj = parseJsonObject(data);
    const fundItems: FundItem[] = [];
    for (const item of jsonObj['datas']) {
        const fundArray: string[] = item.split('|');
        const fundItem: FundItem = {
            code: fundArray[0],
            name: fundArray[1],
            day: fundArray[3],
            unitNetWorth: fundArray[4],
            dayOfGrowth: fundArray[5],
            recent1Week: fundArray[6],
            recent1Month: fundArray[7],
            recent3Month: fundArray[8],
            recent6Month: fundArray[9],
            recent1Year: fundArray[10],
            recent2Year: fundArray[11],
            recent3Year: fundArray[12],
            fromThisYear: fundArray[13],
            fromBuild: fundArray[14],
            serviceCharge: fundArray[20],
        };
        fundItems.push(fundItem);
    }
    return fundItems;
}

export function parseHKRank(data: string): HKFundItem[] {
    const jsonObj = parseJsonObject(data);
    const fundItems: HKFundItem[] = [];
    for (const item of jsonObj['Data']) {
        const fundItem: HKFundItem = {
            FCODE: item['FCODE'],
            SHORTNAME: item['SHORTNAME'],
            JZRQ: item['JZRQ'],
            NAV: item['NAV'],
            D: item['D'],
            W: item['W'],
            M: item['M'],
            Q: item['Q'],
            HY: item['HY'],
            Y: item['Y'],
            TWY: item['TWY'],
            TRY: item['TRY'],
            SY: item['SY'],
            SE: item['SE'],
        };
        fundItems.push(fundItem);
    }
    return fundItems;
}

export function parseFundTheme(data: string): any {
    const jsonObj = parseJsonObject(data);
    return jsonObj['Data'];
}

function parseJsonObject(data: string): any {
    const start: number = data.indexOf('{');
    const end: number = data.lastIndexOf('}') + 1;
    const jsonStr: string = data.slice(start, end);
    const jsonObj: any = eval('(' + jsonStr + ')');
    return jsonObj;
}