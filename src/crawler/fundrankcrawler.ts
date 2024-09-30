'use strict'

import { Task, TaskQueue, Scheduler } from './scheduler';
import Analyzer from '../analyzer/fundanalyzer';
import Util from 'util';

const rankUri1: string = 'http://fund.eastmoney.com/data/FundGuideapi.aspx?dt=4&ft=%s&pi=1&pn=10000';
const rankUri2: string = "https://fundapi.eastmoney.com/fundtradenew.aspx?ft=%s&pi=1&pn=10000";

interface FundItemRank1 {
    code: string;
    name: string;
    fromThisYear: string;
    recent1Week: string;
    recent1Month: string;
    recent3Month: string;
    recent6Month: string;
    recent1Year: string;
    recent2Year: string;
    recent3Year: string;
    day: string;
    unitNetWorth: string;
}

interface FundItemRank2 {
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
    serviceCharge: string;
}

function parseRank1(data: string): FundItemRank1[] {
    const jsonObj = parseJsonObject(data);
    const fundItems: FundItemRank1[] = [];
    for (const item of jsonObj['datas']) {
        let fundItem: FundItemRank1 = {} as FundItemRank1;
        const fundArray: string[] = item.split(','); 
        fundItem['code'] = fundArray[0];
        fundItem['name'] = fundArray[1];
        fundItem['fromThisYear'] = fundArray[4];
        fundItem['recent1Week'] = fundArray[5];
        fundItem['recent1Month'] = fundArray[6];
        fundItem['recent3Month'] = fundArray[7];
        fundItem['recent6Month'] = fundArray[8];
        fundItem['recent1Year'] = fundArray[9];
        fundItem['recent2Year'] = fundArray[10];
        fundItem['recent3Year'] = fundArray[11];
        fundItem['day'] = fundArray[15];
        fundItem['unitNetWorth'] = fundArray[16];
        fundItems.push(fundItem);
    }
    return fundItems;
}

function parseRankUri2(data: string): FundItemRank2[] {
    const jsonObj = parseJsonObject(data);
    const fundItems: FundItemRank2[] = [];
    for (const item of jsonObj['datas']) {
        let fundItem: FundItemRank2 = {} as FundItemRank2;
        const fundArray: string[] = item.split('|'); 
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

function parseJsonObject(data: string): any {
    const start: number = data.indexOf('{');
    const end: number = data.lastIndexOf('}') + 1;
    const jsonStr: string = data.slice(start, end);
    const jsonObj: any = eval('(' + jsonStr + ')');
    return jsonObj;
}

const items: { [key: string]: string } = {
    'all': 'all',
    'gp': 'gupiao',
    'zs': 'zhishu',
    'hh': 'hunhe',
    'zq': 'zhaiquan',
    'qdii': 'qdii',
    'fof': 'fof',
    'lof': 'lof'
};

export const start = function start(): void {
    const queue: TaskQueue = new TaskQueue();
    for (let key in items) {
        const uri: string = Util.format(rankUri1, key);
        const task: Task = new Task(items[key], uri);
        queue.addTask(task);
    }
    const scheduler: Scheduler = new Scheduler(queue, parseRank1, Analyzer.analyze);
    scheduler.start();
};