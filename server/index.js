import assert from 'assert';
import chalk from 'chalk';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

import ServerError, { isServerError } from './errors';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3001);

// Connection URL
const MONGO_URL = 'mongodb://localhost:27017';

// Database Name
const DB_NAME = 'testing';

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
MongoClient.connect(MONGO_URL, (err, mongoClient) => {
  assert.equal(null, err);
  log.success('Connected successfully to mongodb');

  const db = mongoClient.db(DB_NAME);
  const usersCollection = db.collection('users');
  const puzzlesCollection = db.collection('puzzles');

  const getPuzzle = getPuzzleFromCollection(puzzlesCollection);
  const getUser = getUserFromCollection(usersCollection);
  const getSolvedPuzzleCount = async (id) => Object.keys((await getUser(id)).solutions).length;

  // Serve the user api
  app.get('/api/user/:id', async (req, res) => {
    log.api('/api/user/:id', `id: "${req.params.id}"`);

    try {
      res.json({ result: await getUser(req.params.id) });
    } catch (err) {
      log.error(err);
      res.status(404).send('KO');
    }
  });

  // Serve the puzzles
  app.get('/api/puzzles/:id?', async (req, res) => {
    log.api('/api/puzzles/:id?', `id: "${req.params.id}"`);

    let limit;
    try {
      limit = VIEWABLE_PUZZLE_COUNT + (await getSolvedPuzzleCount(req.params.id));
    } catch (err) {
      if (isServerError(err) && err.code == ServerError.ENOENT) {
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
      .toArray((err, result) => {
        if (err) {
          log.error(err);
          res.status(500).send('KO');
        } else {
          res.json({ result });
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
      nAvailable = VIEWABLE_PUZZLE_COUNT + (await getSolvedPuzzleCount(userId));
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
        await usersCollection.updateOne(
          { _id: ObjectId(userId) },
          { $set: { [`solutions.${name}`]: solution } }
        );
        // Send back id
        res.json({ id: userId });
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
