import { HttpRequest, HttpResponse } from './http'

export interface Middlaware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
