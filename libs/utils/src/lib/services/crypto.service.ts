import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoUtilsService {
  constructor(private readonly jwtTokenService: JwtService) {}

  hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  //todo - make async
  generateJwtToken<T extends object>(payload: T, options?: JwtSignOptions) {
    return this.jwtTokenService.sign(payload, options);
  }

  verifyJwtToken(token: string, options?: JwtVerifyOptions) {
    return this.jwtTokenService.verifyAsync(token, options);
  }

  extractJwtPayload<T>(token: string) {
    return this.jwtTokenService.decode(token) as T;
  }

  async verifyAndExtractJwtPayload<T>(
    token: string,
    verifyOptions?: JwtVerifyOptions
  ) {
    await this.verifyJwtToken(token, verifyOptions);
    return this.extractJwtPayload<T>(token);
  }
}
