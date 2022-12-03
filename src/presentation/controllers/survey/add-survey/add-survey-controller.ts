import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import { Controller, AddSurvey, HttpResponse, Validation } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) { }

  async handle (req: AddSurveyController.Req): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req)
      if (error) {
        return badRequest(error)
      }
      const { answers, question } = req
      await this.addSurvey.add({ question, answers, date: new Date() })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

declare module AddSurveyController {
  type Req = {
    question: string
    answers: Answer[]
  }

  type Answer = {
    image?: string
    answer: string
  }
}
