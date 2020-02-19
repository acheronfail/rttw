import chalk from 'chalk';
import { createServer } from './app';
import { config } from './config';
import log from './logger';
import { Store } from './store';
import { runInCluster } from './cluster';

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

    function handleTermination() {
      console.error(chalk.red(`Shutting down thread(${workerId})`));
      store.close();
      app.close();
    }

    process.on('SIGINT', handleTermination);
    process.on('SIGTERM', handleTermination);
  }, clusterOptions);
}

if (require.main === module) {
  main().then(undefined, console.error);
}
