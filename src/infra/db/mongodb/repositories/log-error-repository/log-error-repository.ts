import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    void errorCollection.insertOne({ stack, date: new Date() })
  }
}
