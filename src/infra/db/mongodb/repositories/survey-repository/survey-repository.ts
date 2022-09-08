import { LoadSurveyRepository } from '@/data/protocols/db/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyRepository } from './survey-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository {
  async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return await surveyCollection.find().toArray()
  }

  async add (values: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(values)
  }
}
