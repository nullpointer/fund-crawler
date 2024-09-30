import chalk from 'chalk';

export const info = (message: string): void => {
    console.log(chalk.gray('* ', message));
}

export const success = (message: string): void => {
    console.log(chalk.green('√ ', message));
}

export const error = (message: string): void => {
    console.log(chalk.red('× ', message));
}

