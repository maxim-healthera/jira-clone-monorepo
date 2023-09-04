import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { VerificationEmail, VerificationEmailDocument } from '../schemas/verification-emails';

@Injectable()
export class VerificationEmailsRepository {
  constructor(
    @InjectModel(VerificationEmail.name)
    private verificationEmailModel: Model<VerificationEmail>
  ) {}

  async create(
    emailPayload: VerificationEmail
  ): Promise<VerificationEmailDocument> {
    const newUser = await new this.verificationEmailModel(emailPayload).save();
    return newUser.toJSON();
  }

  // findAll(): Promise<User[]> {
  //   return this.verificationEmailModel.find().exec();
  // }

  // findOneById(id: string) {
  //   return this.verificationEmailModel.findById(id);
  // }

  findOneByQuery(query: FilterQuery<VerificationEmail>) {
    return this.verificationEmailModel.findOne(query);
  }

  deleteById(id: string) {
    return this.verificationEmailModel.deleteOne({ _id: id });
  }
}
