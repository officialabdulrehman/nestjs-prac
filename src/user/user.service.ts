import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(@InjectModel('User') private readonly userModal: Model<User>) {

  }

  async create(createUserInput: CreateUserInput) {
    const createdCat = new this.userModal(createUserInput);
    return await createdCat.save();
  }

  async findAll() {
    return await this.userModal.find().exec()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
