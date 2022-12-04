import { LogErrorRepository } from '@/data/protocols/db/log-error-repository'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LogErrorControllers implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository) { }

  async handle (httpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
