import { Injectable } from "@nestjs/common";
import { MongoDAO } from "../../dao/mongoDAO";
import { User } from "../entities/user.entity";
import { UserModel } from "../user.schema";
import { UserDAOI } from "./user.daoI";

@Injectable()
export class UserDAO extends MongoDAO<User> implements UserDAOI {

  constructor(model: typeof UserModel, dto: User) {
    super(model as any, dto)
  }

  async findOneByEmail(email: string): Promise<User> {
    const result = await this.find({ "email": email }, 1, 1);
    return result.data[0];
  }

}


export const userDAO = new UserDAO(UserModel, new User())