import { SaveSurveyResultRepository } from '@/data/protocols/db/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (values: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultsCollection.findOneAndUpdate({
      surveyId: values.surveyId,
      accoundId: values.accountId
    }, {
      $set: {
        answer: values.answer,
        date: values.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    return res.value && {
      ...res.value,
      id: res.value._id
    }
  }
}
