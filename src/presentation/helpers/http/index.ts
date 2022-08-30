import { UnautorizedError, ServerError } from "../../errors";
import { HttpResponse } from "../../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const forbiden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const unautorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnautorizedError()
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
