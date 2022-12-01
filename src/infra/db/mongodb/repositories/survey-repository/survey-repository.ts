import { LoadSurveyByIdRepository } from '@/data/protocols/db/load-survey-by-id-repository'
import { LoadSurveyRepository } from '@/data/protocols/db/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'
import { AddSurveyRepository } from './survey-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveyRepository, LoadSurveyByIdRepository {
  async load (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return await surveyCollection.find().toArray()
  }

  async add (values: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(values)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    return await surveyCollection.findOne({ _id: new ObjectId(id) })
  }
}
