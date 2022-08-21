export interface UpdateAccessTokenRepository {
  updateAcessToken(token: string, id: string): Promise<void>
}