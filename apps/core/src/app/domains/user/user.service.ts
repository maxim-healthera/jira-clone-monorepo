import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@jira/database-repositories';
import { FilterQuery } from 'mongoose';

import { CreateUserDto } from './dto';
import { CommonUtilsService, CryptoUtilsService } from '@jira/utils';
import { UsersRepository, VerificationEmailsRepository } from '@jira/database-repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly commonService: CommonUtilsService,
    private readonly cryptoService: CryptoUtilsService,
    private readonly usersRepository: UsersRepository,
    private readonly users2Repository: VerificationEmailsRepository,
  ) {
  }

  async create(user: CreateUserDto): Promise<UserDocument> {
    const { password, ...userPayload } = user;
    const hashedPassword = await this.cryptoService.hashPassword(password);
    return this.usersRepository.create({
      ...userPayload,
      password: hashedPassword,
      verified: false
    })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findOneById(id: string) {
    return this.usersRepository.findOneById(id);
  }

  findOneByQuery(query: FilterQuery<User>) {
    return this.usersRepository.findOneByQuery(query);
  }

  prepareUserPayload(user: UserDocument) {
    return this.commonService.deleteProperties(user, ['password', '__v']);
  }
}
