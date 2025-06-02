import { Injectable, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostgreSQLEntity)
    private userRepository: Repository<UserPostgreSQLEntity>,
  ) {}

  async findAll(): Promise<UserPostgreSQLEntity[]> {
    return this.userRepository.find();
  }


  async create(user: UserPostgreSQLEntity): Promise<Partial<UserPostgreSQLEntity>> {
      if (!user.email || !user.password) {
    throw new BadRequestException('Email and password are required');
  }
  const createdUser = await this.userRepository.save(user);
  const { password, ...result } = createdUser;
  return result;
}
}