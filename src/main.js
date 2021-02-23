'use strict';

const RankCrawler = require('./crawler/rankcrawler');
const HKRankCrawler = require('./crawler/hkrankcrawler');
const ThemeCrawler = require('./crawler/themecrawler')

RankCrawler.start();
HKRankCrawler.start();
ThemeCrawler.start();