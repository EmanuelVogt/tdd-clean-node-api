import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-repository";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  test("should return an account on success", async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.create({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@mail.com");
    expect(account.password).toBe("any_password");
  });
});
