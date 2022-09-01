import { badRequest } from '../../../helpers/http'
import { Controller, CreateSurvey, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly createSurvey: CreateSurvey
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    await this.createSurvey.create(httpRequest.body)

    return await new Promise(resolve => resolve(null))
  }
}
