import { Collection, MongoClient } from "mongodb";
export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useUnifiedTopology: true
    });
  },

  async disconect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },
};
