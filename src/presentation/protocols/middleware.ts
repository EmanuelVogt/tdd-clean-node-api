import { HttpResponse } from './http'

export interface Middleware<T = any> {
  handle: (req: T) => Promise<HttpResponse>
}
