import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { Encrypter } from '@/data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }
  async decrypt (value: string): Promise<any> {
    return jwt.verify(value, this.secret) as any
  }

  async encrypt (id: string): Promise<string> {
    return jwt.sign({ id }, this.secret, {
      expiresIn: 10000000000
    })
  }
}
