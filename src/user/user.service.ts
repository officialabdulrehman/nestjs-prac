import { Injectable } from '@nestjs/common';
import { UserDAO } from './dao/user.dao';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {

  constructor(
    private readonly userDAO: UserDAO
  ) { }

  async create(createUserInput: CreateUserInput) {
    return await this.userDAO.create(createUserInput)
  }

  async findAll() {
    return await this.userDAO.find()
  }

  async findOne(id: string) {
    return await this.userDAO.findOne(id)
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    return await this.userDAO.update(id, updateUserInput)
  }

  async remove(id: string) {
    return await this.userDAO.remove(id)
  }
}
