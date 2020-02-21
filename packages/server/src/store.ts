import { Puzzle, User, constants } from '@rttw/common';
import { Collection, Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { acheronfail, season1, season2 } from '../puzzles';

import { Config } from './config';
import StoreError, { isStoreError } from './errors';

const MONGO_CLIENT_OPTIONS: MongoClientOptions = {
  useUnifiedTopology: true,
};

export type UserDocument = Omit<User, '_id'> & { _id: ObjectId };

export class Store {
  private _mongoClient: MongoClient;
  private _db: Db;
  private _collectionUsers: Collection<UserDocument>;
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
    await this._collectionPuzzles.insertMany(season1.concat(season2).concat(acheronfail));
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

  public async getUser(id?: string): Promise<UserDocument> {
    const docs = await this._collectionUsers.find({ _id: new ObjectId(id) }).toArray();
    if (docs.length === 0) {
      throw new StoreError(StoreError.ENOENT, 'no user found');
    }

    return docs[0];
  }

  public async getOrAddUser(id?: string): Promise<UserDocument> {
    try {
      return await this.getUser(id);
    } catch (err) {
      // Create a new user if no user was found.
      if (isStoreError(err) && err.code == StoreError.ENOENT) {
        const { insertedId } = await this.addUser();
        return await this.getUser(insertedId as any);
      }

      throw err;
    }
  }

  public async addUser(): Promise<{ insertedId: string }> {
    const { insertedId } = await this._collectionUsers.insertOne({
      ...constants.BLANK_USER,
      _id: undefined,
    });
    return { insertedId: insertedId.toHexString() };
  }

  public async updateUserSolution(id: string | undefined, name: string, solution: string): Promise<void> {
    await this._collectionUsers.updateOne({ _id: new ObjectId(id) }, { $set: { [`solutions.${name}`]: solution } });
  }

  public async getPuzzle(name: string): Promise<Puzzle> {
    const docs = await this._collectionPuzzles.find({ name }).toArray();
    if (docs.length === 0) {
      throw new StoreError(StoreError.ENOENT, 'no puzzle found');
    }

    return docs[0];
  }

  public async getPuzzles(limit: number): Promise<Puzzle[]> {
    return this._collectionPuzzles
      .find()
      .limit(limit)
      .sort({ index: 1 })
      .toArray();
  }
}
