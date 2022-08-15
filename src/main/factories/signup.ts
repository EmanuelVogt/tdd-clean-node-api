import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { EmailValidatorAdapter } from '../../utils/email-validator.adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/crypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account-repository'

export const makeSignupController = (): SignUpController => {
	const salt = 12
	const emailValidatorAdapter = new EmailValidatorAdapter()
	const encrypter = new BcryptAdapter(salt)
	const accountMongoRepository = new AccountMongoRepository
	const dbAddAccount = new DbAddAccount(encrypter, accountMongoRepository)
	return new SignUpController(emailValidatorAdapter, dbAddAccount)
}