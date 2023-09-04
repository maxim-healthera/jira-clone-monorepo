import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersRepository, VerificationEmailsRepository } from "@jira/database-repositories";
import { CryptoUtilsService } from "@jira/utils";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserVerificationService {
  constructor(
    private readonly verificationEmailsRepository: VerificationEmailsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly cryptoService: CryptoUtilsService,
    private readonly configService: ConfigService,

  ) {}


  async commonVerifyUser(token: string) {
    const verificationEmailDocument = await this.verificationEmailsRepository.findOneByQuery({ token });
    if(!verificationEmailDocument){
      throw new BadRequestException(' Not able to perform this action');
    }

    const jwtPayload = await this.cryptoService.verifyAndExtractJwtPayload<{
      _id: string;
      email: string;
    }>(token, { secret: this.configService.get('JWT_VERIFY_USER_SECRET') });

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      {
        email: jwtPayload.email,
      },
      { verified: true }
    );

    if(!updatedUser) {
      throw new BadRequestException(' Not able to perform this action');
    }

    await this.verificationEmailsRepository.deleteById(verificationEmailDocument._id.toString());
    return { success: true };
  }
}
