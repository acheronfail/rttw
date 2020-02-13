import chalk from "chalk";
import { createExpressApp } from "./app";
import log from "./logger";
import { Store } from "./store";
import config from './config.json';

function terminate(f, message) {
  try {
    log.info(chalk.yellow(message));
    f();
  } catch (err) {
    log.error(err);
  }
}

async function main() {
  const store = await Store.create(config);
  const app = await createExpressApp(store);

  // Start listening for connections
  const server = app.listen(app.get("port"), () => {
    log.success(`Listening at: http://localhost:${app.get("port")}/`);
  });

  // Close the mongo connection and shut down the server when SIGINT received
  process.on("SIGINT", () => {
    console.error(chalk.red(" SIGINT"));
    terminate(() => store.close(), "Closing mongodb connection...");
    terminate(() => server.close(), "Shutting down server...");
  });
}

if (require.main === module) {
  main().then(console.log, console.error);
}
