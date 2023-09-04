import { UserService } from './../../user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@jira/database-repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: Pick<UserDocument, 'email' | '_id'>) {
    const { _id, email } = payload;
    if (!_id || !email) {
      throw new UnauthorizedException('invalid token was provided');
    }
    const userFromDb = await this.userService.findOneById(_id.toString())
    if (userFromDb?.email !== email) {
      throw new UnauthorizedException('invalid token was provided');
    }
    return userFromDb;
  }
}

