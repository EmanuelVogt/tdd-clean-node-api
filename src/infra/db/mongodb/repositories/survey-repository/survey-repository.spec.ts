import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'

import env from '../../../../../main/config/env'
import { AddSurveyModel } from './survey-protocols'
import { SurveyMongoRepository } from './survey-repository'

let surveyCollection: Collection

const makeFakeSurvey = (): AddSurveyModel => (
  {
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }]
  }
)

interface SutTypes {
  sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
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
  })

  test('should save an survey on success', async () => {
    const { sut } = makeSut()
    await sut.add(makeFakeSurvey())
    const survey = await surveyCollection.findOne({ question: 'any_question' })
    void expect(survey).toBeTruthy()
  })
})
