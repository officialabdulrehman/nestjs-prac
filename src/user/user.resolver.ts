import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserPaginated } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  // @Query(() => [User], { name: 'user' })
  @Query(() => UserPaginated)
  async findAll() {
    const result = await this.userService.findAll();
    console.log("result => ", result)
    return result
  }

  @Query(() => User)
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.userService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => String }) id: string) {
    return await this.userService.remove(id);
  }
}
