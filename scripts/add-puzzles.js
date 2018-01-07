// This scripts deletes all the puzzles on the mongodb server and adds all the puzzles found in 
// `../puzzles/season1.js` back to the server.

const { MongoClient } = require('mongodb');

const config = require('../server/config.json');

MongoClient.connect(config.MONGO_URL, async (err, mongoClient) => {
    const db = mongoClient.db(config.DB_NAME);
    const puzzlesCollection = db.collection('puzzles');

    // Get puzzles and add an `index` property
    console.log('Preparing puzzles...');
    const puzzles = require('../puzzles/season1').map((puzzle, i) => {
        puzzle.index = i;
        return puzzle;
    });

    try {
        // Remove all current puzzles
        console.log('Removing puzzles...');
        await puzzlesCollection.remove({}, {});
        // Add in new puzzles
        console.log('Adding puzzles...');
        await puzzlesCollection.insertMany(puzzles);
    } catch (err) {
        console.error('An error occurred :/');
        console.error(err);
    }

    mongoClient.close();
});