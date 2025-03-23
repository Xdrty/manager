import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('sclassId') sclassId: number,
  ) {
    return this.userService.createUser(username, password, sclassId);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(parseInt(id));
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { username?: string; password?: string; sclassId?: number },
  ) {
    return this.userService.updateUser(parseInt(id), body.username, body.password, body.sclassId);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(parseInt(id));
    return { message: 'Пользователь удален' };
  }
}