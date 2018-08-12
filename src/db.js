'use strict';

const GithubDB = require('./githubdb');

exports.write = function (data, filepath) {
    const options = {
        owner: 'nullpointer',
        repo: 'fund-data',
        path: filepath
    };

    const githubDB = new GithubDB(options);
    githubDB.auth(getToken());
    githubDB.connectToRepo();
    githubDB.createFile().then(function () {
        githubDB.save(data);
    }).catch(function () {
        githubDB.save(data, true);
    });
}

function getToken() {
    return process.env.TOKEN.split("").reverse().join("")
}