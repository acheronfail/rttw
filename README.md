# Return true to win

This is a clone of the great online game [return true to win](https://alf.nu/ReturnTrue). 
I made this because the website had been down for a while and I wanted to play that game.

## Using this project

#### Requirements

This project requires the following to be installed:

- [NodeJS](https://nodejs.org/en/)
- [`yarn`](https://yarnpkg.com/en/) (install with `npm i -g yarn` once you have node)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

#### Setting up the database

MongoDB may be installed locally or on a server. Wherever you choose to install it, make sure that
the server's address is updated in the file `server/config.json` so the client and server both know
where to look for the MongoDB database.

Once you've setup MongoDB, you'll want to fill it with the puzzles - simply run `node scripts/prepare-db.js`
which will automatically add the puzzles in the repository to your MongoDB instance.

#### Starting the project

To start the project, make sure the MongoDB is running, then simply run `yarn start`, which will run 
both the server and client (in development mode - nice for seeing the whole app/server locally).

> This project is currently designed so that the client is deployed to GitHub Pages. If you'd like to
host a client/server on your own then it's up to you.

#### Working with the `/client` sub-package

The repo is setup so that if you run `yarn client {command}` then the `{command}` will be sent through
to the `client` sub-package. This makes it so you never have to change directories when working between
the client and server. That basically means that:

- `yarn client` == `cd client && yarn`
- `yarn client start` == `cd client && yarn start`
- `yarn client build` == `cd client && yarn build`
- etc, etc, you get the idea.

## Project Design

This repository contains both the server and the client.

#### Client

The `client/` directory is it's own package and has its own `package.json`. It is run separately to 
the server and is currently setup to be deployed to GitHub Pages. The client makes a series of requests to the
server (hosted elsewhere) in order to get puzzles, submit them, etc.

#### Server

User accounts are generated upon the first submission, and consist are identified only by their `id`. 
This `id` is returned after the first successful submission and is then appended to the URL by the client.
All the user needs to do to log in is append their `id` to the url and the client will automatically make
requests for their solutions and data.

The `users` db document structure is represented as:
```js
{
    // This is both the user's id and the db's id
    "_id": "<ObjectId>",
    // Custom username they may choose
    "username": "<username>",
    // User's solutions to puzzles
    "solutions": {
        "[puzzleName]": "<solution>"
    } 
}
```

The `puzzles` db document structure is represented as:
```js
{
    "_id": "<ObjectId>",
    // Name of the puzzle function (must be a valid JS identifier)
    "name": "<name>",
    // Where the puzzle should appear in the list of puzzles
    "index": "<number>",
    // The setup source of the puzzle
    "source": "<source>"
}
```

<!-- 
TODO: uncomment once username + highscores are complete
There are two indexes on the user db the default `_id` and also another one `username`. This is so
we can rapidly query for user data and check for unique usernames.
-->

<!--
## Roadmap

- [ ] implement highscores
- [ ] implement usernames for users
- [ ] deploy to a server
-->

## Thanks

- Credits go to the original author of [return true to win](https://alf.nu/ReturnTrue).
- This was made in a snap with [`create-react-app`](https://github.com/facebookincubator/create-react-app)
- Some UI components were thrown together with [AtlasKit](https://atlaskit.atlassian.com/)
- It wouldn't have been possible with the excellent [CodeMirror editor](https://codemirror.net)