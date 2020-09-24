const { Octokit } = require('@octokit/rest');
const { parseHTML } = require('cheerio');
const Log = require('../log')

class GitHubDB {

    constructor(options) {
        this.options = options
        this.octokit = new Octokit({
            auth: options.auth
        });
    }

    writeFileContent(path, content) {
        return this.ensureFileExits(path).then(sha => {
            return this.updateFileContents(path, sha, content);
        })
    }

    ensureFileExits(path) {
        return this.getFileSha(path).catch(_ => {
            return this.createFile(path)
        })
    }

    getFileSha(path) {
        return this.getContent(path).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response.data.sha)
            } else {
                return Promise.reject()
            }
        }).catch(_ => {
            return Promise.reject()
        })
    }

    getContent(path) {
        return this.octokit.repos.getContent({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path
        });
    }

    createFile(path) {
        return this.octokit.repos.createOrUpdateFileContents({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path,
            message: 'File created: ' + path,
            content: this._encodeBase64([]),
            committer: this.options.user,
            author: this.options.user
        }).then(_ => {
            Log.info('Create file: ' + path)
            return this.getFileSha(path)
        }).catch(err => {
            Log.error('Failed to create file: ' + path + ' err: ' + err)
            return Promise.reject(err)
        })
    }

    updateFileContents(path, sha, content = []) {
        return this.octokit.repos.createOrUpdateFileContents({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path,
            message: 'File updated at ' + this._timestamp(),
            content: this._encodeBase64(content),
            sha: sha, 	// Required if you are updating a file.
            committer: this.options.user,
            author: this.options.user
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    _encodeBase64(content) {
        return Buffer.from(JSON.stringify(content)).toString('base64');
      };

    _decodeBase64(content) {
        return Buffer.from(content, 'base64').toString('utf8');
      };

    _timestamp() {
        var timestamped = new Date().toUTCString();
        return timestamped;
    }
}

module.exports = { GitHubDB }
