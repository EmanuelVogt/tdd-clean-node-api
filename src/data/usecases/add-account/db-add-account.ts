import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) { }

  async create (account: AddAccountModel): Promise<AccountModel> {
    const passwordEncrypted = await this.encrypter.hash(account.password)
    const newAccount = await this.addAccountRepository.create(
      Object.assign({}, account, { password: passwordEncrypted })
    )
    return newAccount
  }
}
