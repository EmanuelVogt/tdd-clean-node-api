import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './protocols'

export default class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return await new Promise(resolve => resolve(null))
  }
}
