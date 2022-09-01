import { AddSurveyModel } from '../../../../../domain/usecases/add-survey'
import { MongoHelper } from '../../helpers/mongo-helper'
import { AddSurveyRepository } from './survey-protocols'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (values: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(values)
  }
}
