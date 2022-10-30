import { Controller, Get, Param, Post, Body } from '@nestjs/common';
// import { BasicAuthGuard, JwtAuthGuard } from '../auth';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

// Constants
import { CustomResponse } from '../constants/response';

// Services
import { UsersService } from './services';


@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<CustomResponse & {
    body: UserEntity
  } | CustomResponse> {
    return this.usersService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post()
  async createOne(
    @Body() createUserDto: CreateUserDto
  ): Promise<CustomResponse & {
    body: UserEntity
  } | CustomResponse & {
    error: string
  }> {
    return this.usersService.createOne(createUserDto);
  }
}
