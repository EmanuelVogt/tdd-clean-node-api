import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

import env from '@/main/config/env'
import { SurveyResultMongoRepository } from '.'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const fakeAccount =
{
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  accessToken: 'any_token',
  role: 'admin'
}

const makeFakeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(fakeAccount)

  return res.ops[0]
}

const makeFakeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }, { answer: 'other_any_answer' }],
    date: new Date()
  })

  return res.ops[0]
}

type SutTypes = {
  sut: SurveyResultMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyResultMongoRepository()
  return {
    sut
  }
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save', () => {
    test('should save an survey result if its new', async () => {
      const fakeSurvey = await makeFakeSurvey()
      const fakeAccount = await makeFakeAccount()
      const { sut } = makeSut()
      const surveyResult = await sut.save({ accountId: fakeAccount.id, answer: fakeSurvey.answers[0].answer, date: new Date(), surveyId: fakeSurvey.id })
      console.log(surveyResult)
      void expect(surveyResult).toBeTruthy()
      void expect(surveyResult.id).toBeTruthy()
      void expect(surveyResult.answer).toBe(fakeSurvey.answers[0].answer)
    })

    test('should update an survey result if its not new', async () => {
      const fakeSurvey = await makeFakeSurvey()
      const fakeAccount = await makeFakeAccount()
      const res = await surveyResultCollection.insertOne({
        surveyId: fakeSurvey.id,
        accountId: fakeAccount.id,
        answer: fakeSurvey.answers[0].answer,
        data: new Date()
      })
      const { sut } = makeSut()

      const surveyResult = await sut.save({ accountId: fakeAccount.id, answer: fakeSurvey.answers[1].answer, date: new Date(), surveyId: fakeSurvey.id })
      console.log(surveyResult)
      void expect(surveyResult).toBeTruthy()
      void expect(surveyResult.id).toEqual(res.ops[0]._id)
      void expect(surveyResult.answer).toBe(fakeSurvey.answers[1].answer)
    })
  })
})
