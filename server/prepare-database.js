/**
 * This script prepares the MongoDB database and its collections.
 * It does so by deleting all the puzzles on the mongodb server and then adding all the puzzles 
 * found in the `../puzzles/season{n}.js` back into the database.
 */


// This scripts deletes 

const { MongoClient } = require('mongodb');
const config = require('../server/config.json');

// Get puzzles and add an `index` property so MongoDB can order them
let index = 0;
const parsePuzzle = (puzzle) => {
    puzzle.index = index++;
    return puzzle;
};

export async function prepareDatabase(mongoClient) {
    console.log('Preparing puzzles...');
    const seasonOnePuzzles = require('../puzzles/season1').map(parsePuzzle);
    const seasonTwoPuzzles = require('../puzzles/season2').map(parsePuzzle);

    const db = mongoClient.db(config.DB_NAME);
    const puzzlesCollection = db.collection('puzzles');
    // Remove all current puzzles
    console.log('Removing puzzles...');
    await puzzlesCollection.remove({}, {});
    // Add in new puzzles
    console.log('Adding puzzles...');
    await puzzlesCollection.insertMany(seasonOnePuzzles);
    await puzzlesCollection.insertMany(seasonTwoPuzzles);
}
