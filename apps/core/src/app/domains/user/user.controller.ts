import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('users')
export class UserController {

  constructor(private readonly usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getSingleUser(@Param() params: { id: string }) {
    return this.usersService.findOneById(params.id);
  }
}
