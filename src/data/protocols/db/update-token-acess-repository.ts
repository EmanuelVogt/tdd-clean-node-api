export interface UpdateAccessTokenRepository {
  updateAccessToken(token: string, id: string): Promise<void>
}