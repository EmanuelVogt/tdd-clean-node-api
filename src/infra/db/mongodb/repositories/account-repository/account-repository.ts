import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './account-protocols'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/load-account-by-token-repository'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository {
  async loadAccountByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({
      accessToken,
      $or: [{
        role
      },
      {
        role: 'admin'
      }]
    })
    return result && {
      email: result.email,
      id: result._id,
      name: result.name,
      password: result.password,
      accessToken: result.accessToken,
      role: result.role
    }
  }

  async create (values: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(values)
    return result && {
      email: result.ops[0].email,
      id: result.ops[0]._id,
      name: result.ops[0].name,
      password: result.ops[0].password
    }
  }

  async loadAccountByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.findOne({ email })
    return result && {
      email: result.email,
      id: result._id,
      name: result.name,
      password: result.password,
      accessToken: result.accessToken
    }
  }

  async updateAccessToken (token: string, id: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken: token } })
  }
}
