import { BLANK_USER, Puzzle, User } from '@rttw/common';
import { Collection, Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { season1 } from '../puzzles/season1';
import { season2 } from '../puzzles/season2';
import { config } from './config';
import StoreError, { isStoreError } from './errors';

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

  // TODO: Don't delete puzzles each time the database is restarted.
  private async prepare(): Promise<void> {
    await this._collectionPuzzles.deleteMany({});
    await this._collectionPuzzles.insertMany(season1.concat(season2));
  }

  public static create(config: Config): Promise<Store> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.MONGO_URL, MONGO_CLIENT_OPTIONS, async (err, mongoClient) => {
        if (err) {
          reject(err);
        } else {
          const db = mongoClient.db(config.DB_NAME);
          const store = new Store(mongoClient, db);
          await store.prepare();
          resolve(store);
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
          reject(new StoreError(StoreError.ENOENT, 'no user found'));
        } else {
          resolve(docs[0]);
        }
      });
    });
  }

  public async getOrAddUser(id: ObjectId): Promise<User> {
    try {
      return await this.getUser(id);
    } catch (err) {
      // Create a new user if no user was found.
      if (isStoreError(err) && err.code == StoreError.ENOENT) {
        const { insertedId } = await this.addUser();
        return await this.getUser(insertedId);
      }

      throw err;
    }
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
          reject(new StoreError(StoreError.ENOENT, 'no puzzle found'));
        } else {
          resolve(docs[0]);
        }
      });
    });
  }

  public async getPuzzles(limit: number): Promise<Puzzle[]> {
    return this._collectionPuzzles
      .find()
      .limit(limit)
      .sort({ index: 1 })
      .toArray();
  }
}
