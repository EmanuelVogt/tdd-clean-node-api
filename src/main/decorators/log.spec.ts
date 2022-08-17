/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogControllers } from "./log";

interface SutTypes {
  sut: LogControllers
  controllerStub: Controller
}

const makeController = (): Controller => {
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
  return new ControllerStub()
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllers(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('Log Controller decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

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

  test('Should Controller handle method return valid values', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: "any_mail@mail.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(handleSpy).toReturn()
    expect(httpResponse.body).toEqual({
      email: "any_mail@mail.com",
      name: "any_name",
      password: "any_password"
    })
    expect(httpRequest.body).not.toEqual({
      email: "wrong_email",
      name: "wrong_name",
      password: "wrong_password"
    })
  });
});