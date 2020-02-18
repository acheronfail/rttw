import cluster from 'cluster';
import os from 'os';

export const EXIT_CODE_TOO_MANY_RESTARTS = 1;
export const EXIT_CODE_DISCONNECT_TIMEOUT = 2;

export interface RunInClusterOptions {
  restartMaxLimit: number;
  restartTimeoutPeriod: number;

  graceStartTime: number;
  numberOfWorkers: number;
  disconnectTimeout: number;
}

export type ForkedFunction = (id?: number) => void | Promise<void>;

type HRTimestamp = [number, number];

interface WorkerRestartState {
  startTime: HRTimestamp;
  restartTimes: HRTimestamp[];
}

const hrTimeToMilliseconds = ([secs, nanos]: HRTimestamp) => (secs * 1e9 + nanos) / 1e6;

// Check if we've failed to start before the initial grace time.
function didFailBeforeGracePeriod(options: RunInClusterOptions, startTime: HRTimestamp): boolean {
  return hrTimeToMilliseconds(process.hrtime(startTime)) < options.graceStartTime;
}

function shouldRestart(options: RunInClusterOptions, state: WorkerRestartState): boolean {
  // Update the restart times window.
  state.restartTimes = state.restartTimes.filter(t => {
    return hrTimeToMilliseconds(process.hrtime(t)) > options.restartTimeoutPeriod;
  });

  // Check if we've tried to restart too many times a given period.
  const maxRestartsInPeriodExceeded = state.restartTimes.length > options.restartMaxLimit;
  return maxRestartsInPeriodExceeded || didFailBeforeGracePeriod(options, state.startTime);
}

let isExiting = false;
function killAllWorkers() {
  if (isExiting) {
    return;
  }

  isExiting = true;

  // Attempt to gracefully kill all workers.
  cluster.removeAllListeners();
  Object.keys(cluster?.workers).forEach(id => {
    console.log(`Sending SIGTERM to worker: ${id}`);
    cluster.workers[id]?.kill('SIGTERM');
  });

  // If they haven't been killed after a timeout, then forcefully kill them.
  const killTimer = setTimeout(() => {
    Object.keys(cluster?.workers).forEach(id => {
      console.log(`Killing worker: ${id}`);
      cluster.workers[id]?.process.kill();
    });
  }, 5000);

  // Unreference the timer so Node can exit beforehand.
  killTimer.unref();
}

function setupMaster(startTime: HRTimestamp, options: RunInClusterOptions) {
  const restartState: WorkerRestartState = {
    startTime,
    restartTimes: [],
  };

  for (let i = 0; i < options.numberOfWorkers; ++i) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    if (!worker.exitedAfterDisconnect) {
      // Restart the worker if conditions are met.
      if (shouldRestart(options, restartState)) {
        restartState.restartTimes.push(process.hrtime());
        return cluster.fork();
      }

      // Otherwise, kill all workers.
      killAllWorkers();
    }
  });
}

export async function runInCluster(fn: ForkedFunction, userOptions: Partial<RunInClusterOptions> = {}) {
  const options: RunInClusterOptions = {
    restartMaxLimit: 5,
    restartTimeoutPeriod: 1000,
    graceStartTime: 3000,
    numberOfWorkers: Math.ceil(0.75 * os.cpus().length),
    disconnectTimeout: 1000,
    ...userOptions,
  };

  // Keep track of when we started.
  const startTime = process.hrtime();

  // If this is the master node, prepare workers.
  if (cluster.isMaster) {
    setupMaster(startTime, options);
  }

  // Both the master and workers should run the provided function.
  await Promise.resolve(fn(cluster.worker?.id)).catch(err => {
    if (didFailBeforeGracePeriod(options, startTime)) {
      console.error(`Process died within ${options.graceStartTime}ms`);
      console.error(err);
      process.exit(EXIT_CODE_DISCONNECT_TIMEOUT);
    }

    throw err;
  });
}
