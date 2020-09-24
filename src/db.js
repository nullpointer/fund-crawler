
const { GitHubDB } = require('./dao/githubdb')
const Log = require('./log')

function getGitHubPersonalAccessToken() {
    return process.env.TOKEN;
}

const githubDB = new GitHubDB({
    auth: getGitHubPersonalAccessToken(),
    owner: 'nullpointer',
    repo: 'fund-data',
    user: { name: 'duanqz', email: 'duanqz@gmail.com' }
})

class DBTaskQueue {

    constructor() {
        this.dbTasks = []
        this.isRunning = false;
    }

    addDBTask(dbTask) {
        if (dbTask.tryTimes > 2) {
            // Reach the max try times, abort
            return
        }

        dbTask.tryTimes++
        this.dbTasks.push(dbTask)

        this.schedule()
    }

    hasNext() {
        return this.dbTasks.length > 0
    }

    schedule() {
        if (this.isRunning) {
            return;
        }

        if (this.hasNext()) {
            this.isRunning = true

            // Run the first task
            var dbTask = this.dbTasks.pop()
            dbTask.run().then(success => {
                if (!success) {
                    // Failed, add task again to the queue for retry
                    this.addDBTask(dbTask)
                }

                // Contine to schedule
                this.isRunning = false
                this.schedule()
            })
        } else {
            // No task left
            this.isRunning = false
        }
    }
}

class DBTask {
    constructor(path, content) {
        this.path = path
        this.content = content
        this.tryTimes = 0
    }

    run() {
        Log.info('Schedule DB task: ' + this.path + ', try times = ' + this.tryTimes)
        return githubDB.writeFileContent(this.path, this.content).then(response => {
            if (response.status >= 200 && response.status <= 300) {
                Log.success('Succeed to write ' + this.path)
                return Promise.resolve(true)
            } else {
                Log.error('Failed to write ' + this.path + ' status = ' + response.status)
                return Promise.resolve(false)               
            }
        }).catch(err => {
            Log.error('Failed to write ' + this.path + ' err = ' + err)
            return Promise.resolve(false)
        })
    }
}

const queue = new DBTaskQueue()

// insert or update
exports.write = function(path, content) {
    var dbTask = new DBTask(path, content)
    queue.addDBTask(dbTask)
}

