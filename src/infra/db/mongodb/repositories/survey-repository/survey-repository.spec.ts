import { Collection } from 'mongodb'
import { MongoHelper } from '../../helpers/mongo-helper'

import env from '../../../../../main/config/env'
import { AddSurveyModel } from './survey-protocols'
import { SurveyMongoRepository } from './survey-repository'

let surveyCollection: Collection

const makeFakeSurvey = (): AddSurveyModel => (
  {
    question: 'any_question',
    answers: [{ image: 'any_image', answer: 'any_answer' }],
    date: new Date()
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

  describe('add', () => {
    test('should save an survey on success', async () => {
      const { sut } = makeSut()
      await sut.add(makeFakeSurvey())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      void expect(survey).toBeTruthy()
    })
  })

  describe('load', () => {
    test('should return all survey on success', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
        date: new Date()
      }, {
        question: 'any_question_two',
        answers: [{ image: 'any_image', answer: 'any_answer' }],
        date: new Date()
      }])
      const { sut } = makeSut()
      const result = await sut.load()
      void expect(result.length).toBe(2)
    })

    test('should return all survey on success', async () => {
      const { sut } = makeSut()
      const result = await sut.load()
      void expect(result.length).toBe(0)
    })
  })
})
