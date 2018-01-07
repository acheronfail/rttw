import assert from 'assert';
import chalk from 'chalk';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

import ServerError, { isServerError } from './errors';
import config from './config.json';

const app = express();
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3001);

// Amount of unsolved puzzles the user may see
const VIEWABLE_PUZZLE_COUNT = 3;

// The default user template
const BLANK_USER = {
  username: null,
  solutions: {}
};

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

// Use connect method to connect to the mongodb server
MongoClient.connect(config.MONGO_URL, (err, mongoClient) => {
  assert.equal(null, err);
  log.success('Connected successfully to mongodb');

  const db = mongoClient.db(config.DB_NAME);
  const usersCollection = db.collection('users');
  const puzzlesCollection = db.collection('puzzles');

  const getPuzzle = getPuzzleFromCollection(puzzlesCollection);
  const getUser = getUserFromCollection(usersCollection);
  const getSolvedPuzzleCount = async (user) => Object.keys(user.solutions).length;

  // This endpoint serves both the puzzles and the user inforamtion
  app.get('/api/puzzles/:id?', async (req, res) => {
    const { id } = req.params;
    log.api('/api/puzzles/:id?', `id: "${id}"`);

    // Fetch the user and determine how many puzzles are available to them
    let limit, user;
    try {
      user = await getUser(id);
      limit = VIEWABLE_PUZZLE_COUNT + (await getSolvedPuzzleCount(user));
    } catch (err) {
      // If there was no user, then just return a default
      if (isServerError(err) && err.code == ServerError.ENOENT) {
        user = BLANK_USER;
        limit = VIEWABLE_PUZZLE_COUNT;
      } else {
        log.error(err);
        return res.status(500).send('KO');
      }
    }

    // Find and return a sorted list of puzzle available to the user
    puzzlesCollection
      .find()
      .limit(limit)
      .sort({ index: 1 })
      .toArray((err, puzzles) => {
        if (err) {
          log.error(err);
          res.status(500).send('KO');
        } else {
          res.json({ puzzles, user });
        }
      });
  });

  // Receive submissions for puzzles
  app.post('/api/submit', async (req, res) => {
    const { id, name, solution } = req.body;
    log.api('/api/submit', `id: "${id}"`, `name: "${name}"`, `solution: "${solution}"`);

    let nAvailable,
      userId = id;
    try {
      const user = await getUser(userId);
      nAvailable = VIEWABLE_PUZZLE_COUNT + (await getSolvedPuzzleCount(user));
    } catch (err) {
      nAvailable = VIEWABLE_PUZZLE_COUNT;

      // Create a new user if no user was found by that id
      if (isServerError(err) && err.code == ServerError.ENOENT) {
        try {
          const { insertedId } = await usersCollection.insertOne(Object.assign({}, BLANK_USER));
          userId = insertedId;
        } catch (err) {
          log.error(err);
          return res.status(500).send('KO');
        }
      } else {
        log.error(err);
        return res.status(500).send('KO');
      }
    }

    // Disallow submission if user doesn't have access to the puzzle,
    // TODO: verify solution somehow ?
    try {
      const puzzle = await getPuzzle(name);
      if (puzzle.index < nAvailable) {
        // Update solution in db
        const _id = ObjectId(userId);
        await usersCollection.updateOne({ _id }, { $set: { [`solutions.${name}`]: solution } });
        // Send back refreshed user data
        res.json({ result: await getUser(_id) });
      }
    } catch (err) {
      log.error(err);
      res.status(500).send('KO');
    }
  });

  // Start listening for connections
  const server = app.listen(app.get('port'), () => {
    log.success(`Listening at: http://localhost:${app.get('port')}/`);
  });

  // Close the mongo connection and shut down the server when SIGINT received
  process.on('SIGINT', () => {
    console.error(chalk.red(' SIGINT'));
    terminate(() => mongoClient.close(), 'Closing mongodb connection...');
    terminate(() => server.close(), 'Shutting down server...');
  });
});

function terminate(f, message) {
  try {
    log.info(chalk.yellow(message));
    f();
  } catch (err) {
    log.error(err);
  }
}

function getUserFromCollection(collection) {
  return (id) =>
    new Promise((resolve, reject) => {
      collection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else if (docs.length == 0) {
          reject(new ServerError(ServerError.ENOENT, 'no user found'));
        } else {
          resolve(docs[0]);
        }
      });
    });
}

function getPuzzleFromCollection(collection) {
  return (name) =>
    new Promise((resolve, reject) => {
      collection.find({ name }).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else if (docs.length == 0) {
          reject(new ServerError(ServerError.ENOENT, 'no puzzle found'));
        } else {
          resolve(docs[0]);
        }
      });
    });
}
