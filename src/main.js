'use strict';

const RankCrawler = require('./crawler/rankcrawler');
const ThemeCrawler = require('./crawler/themecrawler')

RankCrawler.start();

ThemeCrawler.start();