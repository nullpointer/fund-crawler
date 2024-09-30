import { Octokit } from '@octokit/rest';
import Log from '../log';

interface Options {
    auth: string;
    owner: string;
    repo: string;
    user: string;
}

class GitHubDB {
    private options: Options;
    private octokit: Octokit;

    constructor(options: Options) {
        this.options = options;
        this.octokit = new Octokit({
            auth: options.auth
        });
    }

    writeFileContent(path: string, content: any[]): Promise<any> {
        return this.ensureFileExits(path).then(sha => {
            return this.updateFileContents(path, sha, content);
        });
    }

    ensureFileExits(path: string): Promise<string> {
        return this.getFileSha(path).catch(_ => {
            return this.createFile(path);
        });
    }

    getFileSha(path: string): Promise<string> {
        return this.getContent(path).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response.data.sha);
            } else {
                return Promise.reject();
            }
        }).catch(_ => {
            return Promise.reject();
        });
    }

    getContent(path: string): Promise<any> {
        return this.octokit.repos.getContent({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path
        });
    }

    createFile(path: string): Promise<string> {
        return this.octokit.repos.createOrUpdateFileContents({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path,
            message: 'File created: ' + path,
            content: this._encodeBase64([]),
            committer: this.options.user,
            author: this.options.user
        }).then(_ => {
            Log.info('Create file: ' + path);
            return this.getFileSha(path);
        }).catch(err => {
            Log.error('Failed to create file: ' + path + ' err: ' + err);
            return Promise.reject(err);
        });
    }

    updateFileContents(path: string, sha: string, content: any[] = []): Promise<any> {
        return this.octokit.repos.createOrUpdateFileContents({
            owner: this.options.owner,
            repo: this.options.repo,
            path: path,
            message: 'File updated at ' + this._timestamp(),
            content: this._encodeBase64(content),
            sha: sha,  // Required if you are updating a file.
            committer: this.options.user,
            author: this.options.user
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    private _encodeBase64(content: any): string {
        return Buffer.from(JSON.stringify(content)).toString('base64');
    }

    private _decodeBase64(content: string): string {
        return Buffer.from(content, 'base64').toString('utf8');
    }

    private _timestamp(): string {
        const timestamped = new Date().toUTCString();
        return timestamped;
    }
}

export { GitHubDB };

