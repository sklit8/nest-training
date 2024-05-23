import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {User} from "shared/src/entity/user.entity";
import {AuthDto} from "shared/src/entity/auth.authDto";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              private jwtService: JwtService) {
  }

  /**
   * login
   * @param username
   * @param password
   */
  async login(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || password != user.password) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const payload = { userId: user.id, username: user.username };
    return await this.jwtService.signAsync(payload,{ algorithm: 'HS256' });
  }

  /**
   * register
   * @param payload
   */
  async register(payload: AuthDto): Promise<any> {
    const username = payload.username;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new UnauthorizedException('username already exists!');
    }
    if (payload.password == payload.checkPassword) {
      const newUser = new User();
      newUser.username = payload.username;
      newUser.password = payload.password;
      newUser.firstName = payload.firstName;
      newUser.lastName = payload.lastName;
      newUser.email = payload.email;
      newUser.phone = payload.phone;
      newUser.userStatus = 0;
      await this.userRepository.save(newUser);
      return 'ok';
    }
    return 'error';
  }
}