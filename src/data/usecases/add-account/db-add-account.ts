import { AccountModel } from "../../../domain/models/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account";
import { Encrypter } from "../../protocols/encrypter";

export class DbAddACcount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async create(account: AddAccountModel): Promise<AccountModel> {
    const passwordEncrypted = await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
