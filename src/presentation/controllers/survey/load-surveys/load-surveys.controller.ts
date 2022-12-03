import { noContent, ok, serverError } from '@/presentation/helpers/http'
import { Controller, HttpResponse, LoadSurveys } from './protocols'

export default class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (req: LoadSurveysController.Req): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys.length === 0) return noContent()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

declare module LoadSurveysController {
  type Req = {
  }
}
