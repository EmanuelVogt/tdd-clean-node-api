export interface EmailValidator {
  ensureIsValid: (email: string) => boolean
}
