/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllers } from "./log";

describe('Log Controller decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,

          body: {
            email: "any_mail@mail.com",
            name: "any_name",
            password: "any_password",
          }
        }

        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllers(controllerStub)
    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  });
});