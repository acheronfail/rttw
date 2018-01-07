// This scripts deletes all the puzzles on the mongodb server and adds all the puzzles found in 
// `../puzzles/season1.js` back to the server.

const { MongoClient } = require('mongodb');

const config = require('../server/config.json');

// Get puzzles and add an `index` property so MongoDB can order them
const parsePuzzle = (puzzle, i) => {
    puzzle.index = i;
    return puzzle;
};

MongoClient.connect(config.MONGO_URL, async (err, mongoClient) => {
    const db = mongoClient.db(config.DB_NAME);
    const puzzlesCollection = db.collection('puzzles');

    
    console.log('Preparing puzzles...');
    const seasonOnePuzzles = require('../puzzles/season1').map(parsePuzzle);
    const seasonTwoPuzzles = require('../puzzles/season2').map(parsePuzzle);

    try {
        // Remove all current puzzles
        console.log('Removing puzzles...');
        await puzzlesCollection.remove({}, {});
        // Add in new puzzles
        console.log('Adding puzzles...');
        await puzzlesCollection.insertMany(seasonOnePuzzles);
        await puzzlesCollection.insertMany(seasonTwoPuzzles);
    } catch (err) {
        console.error('An error occurred :/');
        console.error(err);
    }

    mongoClient.close();
});