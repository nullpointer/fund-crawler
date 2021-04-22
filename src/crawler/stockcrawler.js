'use strict'

const DateFormat = require('dateformat');
const Util = require('util')
const FundParser = require('../analyzer/fundparser');
const {Task, TaskQueue, Scheduler} = require('./scheduler')

// Page: http://data.eastmoney.com/zjlx/detail.html

const stockUri = "http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj"

// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj
// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=2&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj
// http://data.eastmoney.com/dataapi/zlsj/list?tkn=eastmoney&ReportDate=2020-12-31&code=&type=6&zjc=0&sortField=&sortDirec=1&pageNum=1&pageSize=10&cfg=jjsjtj

exports.start = function start() {
    var task = new Task('stock', stockUri)

    var queue = new TaskQueue([task])

    var scheduler = new Scheduler(queue)
    scheduler.start()
}