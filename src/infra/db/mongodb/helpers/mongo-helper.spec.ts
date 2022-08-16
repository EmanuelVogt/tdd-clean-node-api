import { MongoHelper as sut } from './mongo-helper'
describe("Mongo helper", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconect()
  })

  test("Should reconect if mongo is down", async () => {
    let accountCollection = sut.getCollection("accounts")
    expect(accountCollection).toBeTruthy()
    await sut.disconect()
    accountCollection = sut.getCollection("accounts")
    expect(accountCollection).toBeTruthy()
  })
});