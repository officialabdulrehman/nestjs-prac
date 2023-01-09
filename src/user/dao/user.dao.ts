import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType, MongoDAO } from '../../dao/mongoDAO';
import { User } from '../entities/user.entity';
import { UserDAOI } from './user.daoI';

@Injectable()
export class UserDAO extends MongoDAO<User> implements UserDAOI {

  constructor(
    @InjectModel('User') protected readonly model: ModelType<User>,
  ) {
    super(model as any, new User() as any)
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.find({ "email": email }, 1, 1);
    return result.data[0];
  }

  async count(): Promise<number> {
    const result = await this.model.count();
    return result
  }

}
