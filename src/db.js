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
        return githubDB.save(data);
    }).catch(function () {
        return githubDB.save(data, true);
    });
}

exports.read = function (filepath) {
    const options = {
        owner: 'nullpointer',
        repo: 'fund-data',
        path: filepath
    };

    const githubDB = new GithubDB(options);
    githubDB.auth(getToken());
    githubDB.connectToRepo();
    return githubDB.find();
}

function getToken() {
    return process.env.TOKEN;
    //return process.env.TOKEN.split("").reverse().join("")
}
