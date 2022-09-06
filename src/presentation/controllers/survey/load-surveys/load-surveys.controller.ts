import { noContent, ok, serverError } from '../../../helpers/http'
import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './protocols'

export default class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) return noContent()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
