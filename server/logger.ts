import chalk from 'chalk';

const log = {
  info: (...args) => console.log(...args),
  success: (...args) => console.log(...args.map((x) => chalk.green(x))),
  api: (path, ...rest) => {
    console.log(chalk.grey('API: ') + chalk.grey(path), ...rest.map((x) => `\t${chalk.grey(x)}`));
  },
  error: (err) => {
    console.log(chalk.red('ERROR'));
    console.log(chalk.red(err.message), chalk.red(err.stack));
  }
};

export default log;
