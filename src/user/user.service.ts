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

  async findOne(id: string) {
    return await this.userModal.findById(id).exec()
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.userModal.findById(id).exec()

    if (updateUserInput.name) {
      user.name = updateUserInput.name
    }

    if (updateUserInput.age) {
      user.age = updateUserInput.age
    }

    return await user.save()
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    return await user.delete()
  }
}
