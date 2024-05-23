import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from "shared/src/entity/user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  /**
   * get user info by user name
   * @param username
   */
  async getUser(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  /**
   * delete by username
   * @param username
   */
  async deleteUser(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return this.userRepository.remove(user);
  }

  /**
   * add a new user info
   * @param user
   */
  async addUser(user: User) {
    const userNew = await this.getUser(user.username);
    if (userNew) {
      throw new NotAcceptableException('user already exists');
    }
    user.userStatus = 0;
    return await this.userRepository.save(user);
  }

  /**
   * update user info
   * @param username
   * @param user
   */
  async updateUser(username: string, user: User) {
    const userOld = await this.userRepository.findOne({ where: { username } });
    if (!userOld) {
      throw new NotAcceptableException('user not exists');
    }
    this.userRepository.delete(user.username);
    user.userStatus = 0;
    return await this.userRepository.save(user);
  }
}
