import DateFormat from 'dateformat';
import Util from 'util';
import FundParser from '../analyzer/fundparser';
import { Task, TaskQueue, Scheduler } from './scheduler';

// Page: http://data.eastmoney.com/zjlx/detail.html

const stockUri: string = "http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj";

// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj
// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj
// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=6&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj

export const start = function start(): void {
    const task: Task = new Task('stock', stockUri);

    const queue: TaskQueue = new TaskQueue([task]);

    const scheduler: Scheduler = new Scheduler(queue);
    scheduler.start();
}

