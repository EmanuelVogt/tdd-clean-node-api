
import { TokenLoginController } from '@/presentation/controllers/account/token-login/token-login.controller'
import { Controller } from '@/presentation/protocols'
import { makeDbTokenAuthentication } from '@/main/factories/usecases/db-token-authentication-factory'

export const makeTokenLoginController = (): Controller => {
  return new TokenLoginController(makeDbTokenAuthentication())
}
