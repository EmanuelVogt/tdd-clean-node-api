import { SignUpController } from "./signup.controller";
import {
  MissingParamError,
} from "../../errors";
import { AccountModel, AddAccount, HttpRequest } from "./signup-protocols";
import { badRequest, ok, serverError } from "../../helpers/http";
import { Validation } from "../../protocols/validation";

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid@email.com",
  password: "valid_password",
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async create(): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  fakeError: Error,
  httpRequest: HttpRequest
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation()

  const sut = new SignUpController(addAccountStub, validationStub);
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  const httpRequest = {
    body: {
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  };
  return {
    sut,
    addAccountStub,
    fakeError,
    httpRequest,
    validationStub
  };
};

describe("signup controller", () => {
  test("should call AddAccount with correct values", async () => {
    const { sut, addAccountStub, httpRequest } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "create");
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub, fakeError, httpRequest } = makeSut();

    jest.spyOn(addAccountStub, "create").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(fakeError));
  });

  test("should return 200 if valid data is provided", async () => {
    const { sut, httpRequest } = makeSut();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  });

  test("should call Validation with correct values", async () => {
    const { sut, validationStub, httpRequest } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("should return 400 if valididation return an error", async () => {
    const { sut, validationStub, httpRequest } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  });
});
