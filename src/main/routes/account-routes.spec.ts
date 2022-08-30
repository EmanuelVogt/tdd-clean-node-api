import { Collection } from "mongodb";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";
import bcrypt from 'bcrypt'
import env from '../config/env'

let accountCollection: Collection

describe("Account routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test("should return 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "any_name",
          email: "any_email@mail.com",
          password: "any_password",
          passwordConfirmation: "any_password",
        })
        .expect(200);
    });
  });
  describe('POST /login', () => {
    test("should return 200 on login", async () => {
      const password = await bcrypt.hash('any_password', 12)
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password
      })
      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(200);
    });

    test("should return 401 on login", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@mail.com",
          password: "any_password",
        })
        .expect(401);
    });
  });
});
