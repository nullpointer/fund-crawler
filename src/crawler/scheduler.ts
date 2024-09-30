import DateFormat from 'dateformat';
import Crawler from 'crawler';
import DB from '../db';
import Log from '../log';

interface Task {
    key: string;
    uri: string;
    headers: Record<string, string>;
    storePath: string;
    recommendStorePath: string;
    tryTimes: number;
}

class Scheduler {
    private tryTimes: number;
    private taskQueue: TaskQueue;
    private crawler: Crawler;

    constructor(taskQueue: TaskQueue, parser: ((body: string) => any) | null = null, analyzer: ((result: any) => any) | null = null) {
        this.tryTimes = 0;
        this.taskQueue = taskQueue;

        this.crawler = new Crawler({
            rateLimit: 1000,
            maxConnections: 1,
            method: 'GET',
            jQuery: true,
            callback: (error: Error | null, res: any, done: () => void) => {
                if (error) {
                    Log.error(error);
                    this.schedule(res.options.task);
                } else {
                    Log.success('Succeed to crawl ' + res.options.uri);

                    const storePath: string = res.options.task.storePath;
                    if (typeof parser === 'function') {
                        const result = parser(res.body);
                        DB.write(storePath, result);

                        if (typeof analyzer === 'function') {
                            const recommendResult = analyzer(result);
                            const recommendStorePath: string = res.options.task.recommendStorePath;
                            DB.write(recommendStorePath, recommendResult);
                        }
                    }
                }
                done();
            }
        });
    }

    start(): void {
        this.taskQueue.list().forEach((task: Task) => {
            this.schedule(task);
        });
    }

    schedule(task: Task): void {
        if (!task.success && task.tryTimes < 3) {
            task.tryTimes++;
            Log.info('Schedule REQ task ' + task.uri + ', try times = ' + task.tryTimes);
            this.crawler.queue({ uri: task.uri, headers: task.headers, task: task });
        }
    }
}

class TaskQueue {
    private tasks: Task[];

    constructor(tasks: Task[] = []) {
        this.tasks = tasks;
    }

    list(): Task[] {
        return this.tasks;
    }

    addTask(task: Task): void {
        this.tasks.push(task);
    }

    popTask(): Task | undefined {
        return this.tasks.pop();
    }

    hasNext(): boolean {
        return this.tasks.length > 0;
    }
}

const userAgents: string[] = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
    'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.84 Safari/535.11 SE 2.X MetaSr 1.0',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.3.4000 Chrome/30.0.1599.101 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 UBrowser/4.0.3214.0 Safari/537.36'
];

class Task {
    public storePath: string;
    public recommendStorePath: string;
    public uri: string;
    public headers: Record<string, string>;
    public tryTimes: number;

    constructor(key: string, uri: string, headers: Record<string, string> = {}) {
        const now: string = DateFormat(new Date(), 'yyyy/mm/dd');
        this.storePath = now + '/' + key + '.json';
        this.recommendStorePath = now + '/' + key + '.recommend.json';
        this.uri = uri;

        let userAgent: string = userAgents[Task.getRandomInt(userAgents.length)];
        headers['User-Agent'] = userAgent;
        this.headers = headers;

        this.tryTimes = 0;
    }

    static getRandomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

export { Task, TaskQueue, Scheduler };