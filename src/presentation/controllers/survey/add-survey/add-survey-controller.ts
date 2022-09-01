import { badRequest, noContent, serverError } from '../../../helpers/http'
import { Controller, AddSurvey, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly createSurvey: AddSurvey
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      await this.createSurvey.create(httpRequest.body)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
