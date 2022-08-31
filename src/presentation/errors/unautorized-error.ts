export class UnautorizedError extends Error {
  constructor () {
    super('Invalid credentials')
    this.name = 'InvalidCredentials'
  }
}
