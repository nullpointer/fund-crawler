import { Task, TaskQueue, Scheduler } from './scheduler';
import Analyzer from '../analyzer/fundanalyzer';

const hkRankUri: string = "http://overseas.1234567.com.cn/overseasapi/OpenApiHander.ashx?api=HKFDApi&m=MethodFundList&action=1&pageindex=0&pagesize=50&dy=1&date1=2020-02-23&date2=2021-02-23&sortfield=W&sorttype=-1&isbuy=0&callback=jQuery18307391053966150833_1614082770915&_=%s";

const headers: { [key: string]: string } = {
    'Host': 'overseas.1234567.com.cn',
    'Proxy-Connection': 'keep-alive',
    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate',
    'Referer': 'http://overseas.1234567.com.cn/FundList',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'X-Requested-With': 'XMLHttpRequest'
};

interface FundItem {
    code: string;
    name: string;
    day: string;
    unitNetWorth: number;
    dayOfGrowth: number;
    recent1Week: number;
    recent1Month: number;
    recent3Month: number;
    recent6Month: number;
    recent1Year: number;
    recent2Year: number;
    recent3Year: number;
    fromThisYear: number;
    fromBuild: number;
}

function parseHKRank(data: string): FundItem[] {
    const jsonObj: { [key: string]: any } = parseJsonObject(data);
    const fundItems: FundItem[] = [];
    for (const item of jsonObj['Data']) {
        let fundItem: FundItem = {
            code: item['FCODE'],
            name: item['SHORTNAME'],
            day: item['JZRQ'],
            unitNetWorth: item['NAV'],
            dayOfGrowth: item['D'],
            recent1Week: item['W'],
            recent1Month: item['M'],
            recent3Month: item['Q'],
            recent6Month: item['HY'],
            recent1Year: item['Y'],
            recent2Year: item['TWY'],
            recent3Year: item['TRY'],
            fromThisYear: item['SY'],
            fromBuild: item['SE']
        };
        fundItems.push(fundItem);
    }
    return fundItems;
}

function parseJsonObject(data: string): { [key: string]: any } {
    const start: number = data.indexOf('{');
    const end: number = data.lastIndexOf('}') + 1;
    const jsonStr: string = data.slice(start, end);
    const jsonObj: { [key: string]: any } = eval('(' + jsonStr + ')');

    return jsonObj;
}

export const start = function start(): void {
    const task: Task = new Task('hk', hkRankUri, headers);
    const queue: TaskQueue = new TaskQueue([task]);
    const scheduler: Scheduler = new Scheduler(queue, parseHKRank, Analyzer.analyze);
    scheduler.start();
};