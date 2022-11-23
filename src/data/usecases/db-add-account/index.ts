import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async create (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(accountData.email)
    if (!account) {
      const passwordEncrypted = await this.encrypter.hash(accountData.password)
      const newAccount = await this.addAccountRepository.create(
        Object.assign({}, accountData, { password: passwordEncrypted })
      )
      return newAccount
    }
    return null
  }
}
