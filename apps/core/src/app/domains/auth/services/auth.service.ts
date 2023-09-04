import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { CommonUtilsService, CryptoUtilsService } from '@jira/utils';
import { UserDocument } from '@jira/database-repositories';
import { CreateUserDto } from '../../user/dto';
import { EmailsService } from '../../emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly cryptoService: CryptoUtilsService,
    private readonly commonService: CommonUtilsService,
    private readonly emailsService: EmailsService
  ) {}

  googleLogin(user: UserDocument) {
    const { _id, email } = user;
    const payload = { _id, email };

    return {
      _id,
      email,
      access_token: this.createSignedJwtWithPayload(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const userFromDb = await this.usersService.findOneByQuery({ email });
    if (!userFromDb?.password) {
      throw new UnauthorizedException('Invalid Login or Password');
    }

    const isPasswordValid = await this.cryptoService.validatePassword(
      password,
      userFromDb.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Login or Password');
    }
    return userFromDb.toJSON();
  }

  async loginWithCredentials(user: UserDocument) {
    const { _id, email } = user;
    const payload = { _id, email };
    await this.commonService.wait();

    return {
      user: this.usersService.prepareUserPayload(user),
      access_token: this.createSignedJwtWithPayload(payload),
    };
  }

  async register(user: CreateUserDto) {
    const isUserPresent = await this.usersService.findOneByQuery({
      email: user.email,
    });
    if (isUserPresent) {
      throw new BadRequestException('User with such email already exists');
    }
    const newUser = await this.usersService.create(user);
    this.emailsService.verifyUser(newUser);
    return this.loginWithCredentials(newUser);
  }

  createSignedJwtWithPayload(
    payload: Pick<UserDocument, 'email' | '_id'>
  ): string {
    return this.cryptoService.generateJwtToken(payload);
  }
}
