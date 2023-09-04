import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User): Promise<UserDocument> {
    const newUser = await new this.userModel(user).save();
    return newUser.toJSON();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOneById(id: string) {
    return this.userModel.findById(id);
  }

  findOneByQuery(query: FilterQuery<User>) {
    return this.userModel.findOne(query);
  }

  findOneAndUpdate(
    query: FilterQuery<User>,
    payload: UpdateQuery<User>,
    options?: QueryOptions
  ) {
    return this.userModel.findOneAndUpdate(query, payload, {
      new: true,
      ...options,
    });
  }
}
