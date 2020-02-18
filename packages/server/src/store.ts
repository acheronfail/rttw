import { BLANK_USER, Puzzle, User } from '@rttw/common';
import { Collection, Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { config } from './config';
import ServerError from './errors';
import { prepareDatabase } from './prepare-database';

export type Config = typeof config;

const MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  useUnifiedTopology: true,
};

export class Store {
  private _mongoClient: MongoClient;
  private _db: Db;
  private _collectionUsers: Collection<User>;
  private _collectionPuzzles: Collection<Puzzle>;
  private constructor(mongoClient: MongoClient, db: Db) {
    this._mongoClient = mongoClient;
    this._db = db;
    this._collectionUsers = this._db.collection('users');
    this._collectionPuzzles = this._db.collection('puzzles');
  }

  public static create(config: Config): Promise<Store> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.MONGO_URL, MONGO_CLIENT_OPTIONS, async (err, mongoClient) => {
        if (err) {
          reject(err);
        } else {
          await prepareDatabase(mongoClient);
          const db = mongoClient.db(config.DB_NAME);
          resolve(new Store(mongoClient, db));
        }
      });
    });
  }

  public close() {
    this._mongoClient.close();
  }

  public async getUser(id: ObjectId): Promise<User> {
    return new Promise((resolve, reject) => {
      this._collectionUsers.find({ _id: new ObjectId(id) }).toArray((err, docs) => {
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

  public async addUser(): Promise<{ insertedId: ObjectId }> {
    const { insertedId } = await this._collectionUsers.insertOne(Object.assign({}, BLANK_USER));
    return { insertedId };
  }

  public async updateUserSolution(id: ObjectId, name: string, solution: string): Promise<void> {
    await this._collectionUsers.updateOne({ _id: id }, { $set: { [`solutions.${name}`]: solution } });
  }

  public async getPuzzle(name: string): Promise<Puzzle> {
    return new Promise((resolve, reject) => {
      this._collectionPuzzles.find({ name }).toArray((err, docs) => {
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

  public async getPuzzles(limit: number): Promise<Puzzle[]> {
    return new Promise((resolve, reject) => {
      this._collectionPuzzles
        .find()
        .limit(limit)
        .sort({ index: 1 })
        .toArray((err, puzzles) => {
          if (err) {
            reject(err);
          } else {
            resolve(puzzles);
          }
        });
    });
  }
}
