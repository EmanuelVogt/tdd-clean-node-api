export interface AuthenticationModel {
  email: string
  password: string
}

export interface Authentication {
  auth({ email, password }: AuthenticationModel): Promise<string>
}