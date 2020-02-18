import chalk from 'chalk';

const log = {
  info: (...args: any[]) => console.log(...args),
  success: (...args: any[]) => console.log(...args.map(x => chalk.green(x))),
  api: (path: string, ...rest: any[]) => {
    console.log(chalk.grey('API: ') + chalk.grey(path), ...rest.map(x => `\t${chalk.grey(x)}`));
  },
  error: (err: Error) => {
    console.log(chalk.red('ERROR'));
    console.log(chalk.red(err.message), chalk.red(err.stack));
  },
};

export default log;
