import { Controller, forbidden, HttpRequest, HttpResponse, InvalidParamError, LoadSurveyById, noContent, ok, SaveSurveyResult, serverError } from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { answer } = httpRequest.body
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
        const surveyResult = await this.saveSurveyResult.save({
          accountId: httpRequest.accountId,
          answer: httpRequest.body.answer,
          date: new Date(),
          surveyId: httpRequest.params.surveyId
        })

        if (surveyResult) {
          return ok(surveyResult)
        }

        return noContent()
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
