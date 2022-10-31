import { Injectable, HttpStatus, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {v4} from 'uuid';

// DTOs
import { CreateUserDto } from '../dto/create-user.dto';

// Constants
import { CustomResponse } from '../../constants/response';
import { USERS_REPOSITORY } from '../../constants/database';

// Entities
import { UserEntity } from '../entities/user.entity';

// Utils
import { isEntityExist } from '../../utils/validation';
import { createResponse } from '../../utils/create-response';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

    async findOneByNameAndPassword(name: string, password: string): Promise<UserEntity | undefined> {
      return this.userRepository.findOne({
        where: {
          name,
          password
        }
      })
    }

  async findOne(userId: string): Promise<CustomResponse & {
    body: UserEntity
  } | CustomResponse> {
    const user = isEntityExist(await this.userRepository.findOne({
      where: {
        id: userId
      }
    }), 'User');

    if (!(user instanceof UserEntity)) {
      return user;
    }
    
    return createResponse(HttpStatus.OK, 'OK', user);
  }

  async createOne(createUserDto: CreateUserDto): Promise<CustomResponse & {
    body: UserEntity
  } | CustomResponse & {
    error: string
  }> {
    try {
      const newUser = await this.userRepository.save({id: v4(), ...createUserDto});

      return createResponse(HttpStatus.CREATED, 'User has been created', newUser); 
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong during creation of user',
        error: JSON.stringify(err)
      }
    }
  }
}
