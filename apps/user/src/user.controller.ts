import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {JwtGuard} from "shared/src/guard/jwt.guard";
import {User} from "shared/src/entity/user.entity";


@ApiTags('User')
@Controller('user')
@UseGuards(JwtGuard) //守卫，设置token
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  /**
   * get user info by username
   * @param usernema
   */
  @Get('/:username')
  getUser(@Param('username') usernema: string): any {
    return this.userService.getUser(usernema);
  }

  /**
   * update user info
   * @param user
   * @param username
   */
  @Put('/:username')
  updateUser(@Body() user: User, @Param('username') username: string): any {
    return this.userService.updateUser(username, user);
  }

  /**
   * delete user by username
   * @param usernema
   */
  @Delete('/:username')
  deleteUser(@Param('username') usernema: string): any {
    return this.userService.deleteUser(usernema);
  }

  /**
   * add a new user info
   * @param dto
   */
  @Post('/addUser')
  addUser(@Body() dto: User): any {
    return this.userService.addUser(dto);
  }
}
