import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {AuthDto} from "shared/src/entity/auth.authDto";


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  /**
   * login
   * @param loginDto
   */
  @Post('/login')
  async login(@Body() loginDto: AuthDto): Promise<any> {
    const { username, password } = loginDto;
    const token = await this.authService.login(username, password);
    return {
      access_token: token,
    };
  }

  /**
   * register
   * @param register
   */
  @Post('/register')
  register(@Body() register: AuthDto): any {
    console.log(register);
    return this.authService.register(register);
  }

  /**
   * logout
   */
  @Get('/logout')
  logout(): any {
    return null;
  }
}
