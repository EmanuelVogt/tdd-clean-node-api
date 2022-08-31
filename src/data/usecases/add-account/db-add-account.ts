import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async create (account: AddAccountModel): Promise<AccountModel> {
    const passwordEncrypted = await this.encrypter.hash(account.password)
    await this.loadAccountByEmailRepository.loadAccountByEmail(account.email)
    const newAccount = await this.addAccountRepository.create(
      Object.assign({}, account, { password: passwordEncrypted })
    )
    return newAccount
  }
}
