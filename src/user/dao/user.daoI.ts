import { DAOI } from "../../dao/daoI";
import { User } from "../entities/user.entity";

export interface UserDAOI extends DAOI<User> {
  findOneByEmail(email: string): Promise<User>
  count(): Promise<number>
}