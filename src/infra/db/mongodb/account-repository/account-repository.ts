import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "./account-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async create(values: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(values);
    return result && {
      email: result.ops[0].email,
      id: result.ops[0]._id,
      name: result.ops[0].name,
      password: result.ops[0].password,
    };
  }

  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.findOne({ email })
    return result && {
      email: result.email,
      id: result._id,
      name: result.name,
      password: result.password,
    };
  }

  async updateAccessToken(token: string, id: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken: token } })
  }
}
