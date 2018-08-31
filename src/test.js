'use strict';

const request = require('request');
const Analyzer = require('./fundanalyzer');

request(
    {
        url: 'https://raw.githubusercontent.com/nullpointer/fund-data/master/2018/08/30/lof.json',
        json: true
    }, function (error, response, body) {
        const funds = Analyzer.analyze(body);
        console.log(funds);
    });
