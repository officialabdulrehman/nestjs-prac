// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { MongoDAO } from "../../dao/mongoDAO";
// import { User } from "../entities/user.entity";
// import { UserDAOI } from "./user.daoI";

// @Injectable()
// export class UserDAO extends MongoDAO<User> implements UserDAOI {

//   constructor(@InjectModel('User') model: Model<User>, dto: User) {
//     super(model as any, dto)
//   }

//   async findOneByEmail(email: string): Promise<User> {
//     const result = await this.find({ "email": email }, 1, 1);
//     return result.data[0];
//   }

// }

// export const userDAO = new UserDAO(UserModel, new User())



import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { User } from '../entities/user.entity';

@Injectable()
export class UserDAO {

  constructor(
    @InjectModel('User') private readonly userModal: Model<User>,
  ) { }

  async create(createUserInput: CreateUserInput) {
    const user = new this.userModal(createUserInput);
    return await user.save();
  }

  async find() {
    return await this.userModal.find().exec()
  }

  async findOne(id: string) {
    return await this.userModal.findById(id).exec()
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.userModal.findById(id).exec()

    // if (updateUserInput.name) {
    //   user.name = updateUserInput.name
    // }

    // if (updateUserInput.age) {
    //   user.age = updateUserInput.age
    // }

    return await user.save()
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    return await user.delete()
  }
}
