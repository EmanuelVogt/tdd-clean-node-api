import jwt from "jsonwebtoken";
import { Encrypter } from "../../../data/protocols/criptography/encrypter";

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string){}

  async encrypt(id: string): Promise<string> {
    const token = jwt.sign(id, this.secret)
    return token
  }
}