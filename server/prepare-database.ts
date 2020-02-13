import config from './config.json';
import season1 from '../puzzles/season1';
import season2 from '../puzzles/season2';
import { MongoClient } from 'mongodb';

export async function prepareDatabase(mongoClient: MongoClient) {
    console.log('Preparing puzzles...');

    const db = mongoClient.db(config.DB_NAME);
    const puzzlesCollection = db.collection('puzzles');

    // Remove all current puzzles
    console.log('Removing puzzles...');
    await puzzlesCollection.remove({}, {});

    // Add in new puzzles
    console.log('Adding puzzles...');
    await puzzlesCollection.insertMany(season1);
    await puzzlesCollection.insertMany(season2);
}
