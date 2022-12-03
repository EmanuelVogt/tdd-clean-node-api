import { Controller, forbidden, HttpResponse, InvalidParamError, LoadSurveyById, noContent, ok, SaveSurveyResult, serverError } from './protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) { }

  async handle (req: SaveSurveyResultController.Req): Promise<HttpResponse> {
    try {
      const { answer } = req
      const survey = await this.loadSurveyById.loadById(req.surveyId)
      if (survey) {
        const answers = survey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
        const surveyResult = await this.saveSurveyResult.save({
          accountId: req.accountId,
          answer: req.answer,
          date: new Date(),
          surveyId: req.surveyId
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

declare module SaveSurveyResultController {
  type Req = {
    answer: string
    surveyId: string
    accountId: string
  }
}
