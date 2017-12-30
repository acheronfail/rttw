import assert from 'assert';
import chalk from 'chalk';
import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.set('port', process.env.PORT || 3001);

// Connection URL
const MONGO_URL = 'mongodb://localhost:27017';

// Database Name
const DB_NAME = 'myproject';

// Use connect method to connect to the mongodb server
MongoClient.connect(MONGO_URL, (err, mongoClient) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = mongoClient.db(DB_NAME);

  app.get('/api/test', (req, res) => {
    return res.json({ hello: 'world' });
  });

  const server = app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
  });

  // Close the mongo connection and shut down the server when SIGINT received
  process.on('SIGINT', () => {
    console.log(chalk.red(' SIGINT!'));
    console.log(chalk.yellow('Closing mongodb connection...'));
    mongoClient.close();
    console.log(chalk.yellow('Shutting down server...'));
    server.close();
  });
});
