import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Hasher;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(
    encrypter: Hasher,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async create(account: AddAccountModel): Promise<AccountModel> {
    const passwordEncrypted = await this.encrypter.hash(account.password);
    const newAccount = await this.addAccountRepository.create(
      Object.assign({}, account, { password: passwordEncrypted })
    );
    return newAccount;
  }
}
