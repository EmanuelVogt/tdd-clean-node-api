import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from './account-repository'

let accountCollection: Collection

const fakeAccount =
{
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  accessToken: 'any_token',
  role: 'admin'
}

interface SutTypes {
  sut: AccountMongoRepository
}
const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('should return an account on create success', async () => {
    const { sut } = makeSut()
    const account = await sut.create(fakeAccount)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return an account on loadAccountByEmail success', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne(fakeAccount)
    const account = await sut.loadAccountByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('should return null if loadAccountByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadAccountByEmail('any_email@mail.com')
    expect(account).toBeFalsy()
  })

  test('should update access token on updateAccessToken success', async () => {
    const { sut } = makeSut()
    const { ops } = await accountCollection.insertOne(fakeAccount)
    await sut.updateAccessToken('any_token', ops[0]._id)
    const account = await accountCollection.findOne({ _id: ops[0]._id })
    expect(account.accessToken).toBe('any_token')
  })

  test('should return an account on loadAccountByToken without role', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne(fakeAccount)
    const account = await sut.loadAccountByToken('any_token')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
    expect(account.accessToken).toBe('any_token')
    expect(account.role).toBe('admin')
  })

  test('should return null on loadAccountByToken with invalid role', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      accessToken: 'any_token'
    })
    const account = await sut.loadAccountByToken('any_token', 'admin')
    expect(account).toBeFalsy()
  })

  test('should return an account on loadAccountByToken if user is admin', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne(fakeAccount)
    const account = await sut.loadAccountByToken('any_token')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
    expect(account.accessToken).toBe('any_token')
    expect(account.role).toBe('admin')
  })

  test('should return an account on loadAccountByToken with role', async () => {
    const { sut } = makeSut()
    await accountCollection.insertOne(fakeAccount)
    const account = await sut.loadAccountByToken('any_token', 'admin')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
    expect(account.accessToken).toBe('any_token')
    expect(account.role).toBe('admin')
  })
})
