'use strict';

import { Task, TaskQueue, Scheduler } from './scheduler';
import Util from 'util';

const themeUri: string = "http://api.fund.eastmoney.com/ztjj/GetZTJJList?callback=jQuery183034382836069271905_1613810977162&tt=0&dt=syl&st=%s&_=%s";

const headers: { [key: string]: string } = {
    'Host': 'api.fund.eastmoney.com',
    'Proxy-Connection': 'keep-alive',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate',
    'Referer': 'http://fund.eastmoney.com/',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
};

function parseFundTheme(data: string): any {
    const jsonObj: any = parseJsonObject(data);
    return jsonObj['Data'];
}

function parseJsonObject(data: string): any {
    const start: number = data.indexOf('{');
    const end: number = data.lastIndexOf('}') + 1;
    const jsonStr: string = data.slice(start, end);
    const jsonObj: any = eval('(' + jsonStr + ')');

    return jsonObj;
}

export const start = function start(): void {
    const uri: string = Util.format(themeUri, 'SYL_W', Date.now());
    const task: Task = new Task('theme', uri, headers);

    const queue: TaskQueue = new TaskQueue([task]);

    const scheduler: Scheduler = new Scheduler(queue, parseFundTheme);
    scheduler.start();
};