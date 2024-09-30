import { GitHubDB } from './dao/githubdb';
import Log from './log';

function getGitHubPersonalAccessToken(): string | undefined {
    return process.env.TOKEN;
}

const githubDB = new GitHubDB({
    auth: getGitHubPersonalAccessToken(),
    owner: 'fundvis',
    repo: 'fund-data',
    user: { name: 'duanqz', email: 'duanqz@gmail.com' }
});

interface DBTaskInterface {
    path: string;
    content: string;
    tryTimes: number;
    run: () => Promise<boolean>;
}

class DBTaskQueue {
    private dbTasks: DBTaskInterface[] = [];
    private isRunning: boolean = false;

    addDBTask(dbTask: DBTaskInterface): void {
        if (dbTask.tryTimes > 2) {
            // Reach the max try times, abort
            return;
        }

        dbTask.tryTimes++;
        this.dbTasks.push(dbTask);

        this.schedule();
    }

    hasNext(): boolean {
        return this.dbTasks.length > 0;
    }

    schedule(): void {
        if (this.isRunning) {
            return;
        }

        if (this.hasNext()) {
            this.isRunning = true;

            // Run the first task
            const dbTask = this.dbTasks.pop();
            dbTask!.run().then(success => {
                if (!success) {
                    // Failed, add task again to the queue for retry
                    this.addDBTask(dbTask!);
                }

                // Continue to schedule
                this.isRunning = false;
                this.schedule();
            });
        } else {
            // No task left
            this.isRunning = false;
        }
    }
}

class DBTask implements DBTaskInterface {
    path: string;
    content: string;
    tryTimes: number = 0;

    constructor(path: string, content: string) {
        this.path = path;
        this.content = content;
    }

    run(): Promise<boolean> {
        Log.info('Schedule DB task: ' + this.path + ', try times = ' + this.tryTimes);
        return githubDB.writeFileContent(this.path, this.content).then(response => {
            if (response.status >= 200 && response.status <= 300) {
                Log.success('Succeed to write ' + this.path);
                return Promise.resolve(true);
            } else {
                Log.error('Failed to write ' + this.path + ' status = ' + response.status);
                return Promise.resolve(false);
            }
        }).catch(err => {
            Log.error('Failed to write ' + this.path + ' err = ' + err);
            return Promise.resolve(false);
        });
    }
}

const queue = new DBTaskQueue();

// insert or update
export function write(path: string, content: string): void {
    const dbTask = new DBTask(path, content);
    queue.addDBTask(dbTask);
}

