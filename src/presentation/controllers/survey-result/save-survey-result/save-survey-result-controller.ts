import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, serverError } from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) { }
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
