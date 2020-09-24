const chalk = require('chalk')

exports.info = function(message) {
    console.log((0, chalk.gray)('* ', message))
}

exports.success = function(message) {
    console.log((0, chalk.green)('√ ', message))
}

exports.error = function(message) {
    console.log((0, chalk.red)('× ', message))
}
