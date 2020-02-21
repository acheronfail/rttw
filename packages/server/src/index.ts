import chalk from 'chalk';
import { createServer } from './app';
import { config } from './config';
import log from './logger';
import { Store } from './store';
import { runInCluster } from './cluster';
import { ExitCode } from './constants';

async function main() {
  const clusterOptions = {
    ...(process.env.NODE_ENV === 'development' && { numberOfWorkers: 0 }),
  };

  runInCluster(async id => {
    const workerId = id || 'master';

    const store = await Store.create(config);
    const app = await createServer(store);

    const port = 3001;
    app.listen(port, err => {
      if (err) {
        throw err;
      }

      log.success(`Thread(${workerId}) opened on port: ${port}`);
    });

    async function handleTermination(err?: Error, code = 0) {
      console.error(chalk.red(`Shutting down thread(${workerId})`));
      await Promise.all([store.close(), app.close()]);
      process.exit(code);
    }

    process.on('SIGINT', () => handleTermination(undefined, ExitCode.Termination));
    process.on('SIGTERM', () => handleTermination(undefined, ExitCode.Termination));
    process.on('uncaughtException', err => handleTermination(err, ExitCode.UncaughtException));
    process.on('unhandledRejection', reason =>
      handleTermination(new Error(`unhandledRejection: ${reason?.toString()}`), ExitCode.UnhandledRejection),
    );
  }, clusterOptions);
}

if (require.main === module) {
  main().then(undefined, err => {
    console.error(err);
    process.exit(ExitCode.ApplicationError);
  });
}
