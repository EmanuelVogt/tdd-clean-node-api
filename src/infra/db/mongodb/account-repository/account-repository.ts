import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from "./account-protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async create(values: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(values);

    return {
      email: result.ops[0].email,
      id: result.ops[0]._id,
      name: result.ops[0].name,
      password: result.ops[0].password,
    };
  }
}
