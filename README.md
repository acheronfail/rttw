# Return true to win

This is a clone of the great online game [return true to win](https://alf.nu/ReturnTrue). 
I made this because the website has been down for a while and I loved playing that game.

You can visit the website here: https://acheronfail.github.io/rttw/

_NOTE: Since this project is very new it may be down from time to time until I get it stable._

## Using this project

This project requires the following to be installed:

- [NodeJS](https://nodejs.org/en/)
- [`yarn`](https://yarnpkg.com/en/) (install with `npm i -g yarn` once you have node)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

MongoDB may be installed locally or on a server. Wherever you choose to install it, make sure that
the server's address is updated in the file `server/config.json` so the client and server both know
where to look for the MongoDB database.

To start the project, make sure the MongoDB is running, then simply run `yarn start`, which will run 
both the server and client.

> This project currently runs in development mode, and hasn't yet been configured to run in any sort
of production environment.

### Project Design

This repository contains both the server and the client.

#### Client

The `client/` directory is it's own package and has its own `package.json`. It is run separately to 
the server and is currently deployed to GitHub Pages. The client makes a series of requests to the
server (hosted elsewhere) in order to get puzzles, submit them, etc.

#### Server

User accounts are generated upon the first submission, and consist only of an `id`. This id is
returned after the first successful submission and is then appended to the URL by the client. All 
the user needs to do to log in is append their id to the url and the client will automatically make
requests for their solutions and data.

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

There are two indexes on the user db the default `_id` and also another one `username`. This is so
we can rapidly query for user data and check for unique usernames.

## Thanks

- Credits go to the original author of [return true to win](https://alf.nu/ReturnTrue).
- This was made in a snap with [`create-react-app`](https://github.com/facebookincubator/create-react-app)
- It wouldn't have been possible with the excellent [CodeMirror editor](https://codemirror.net)
