import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPostgreSQLEntity } from 'src/entities/user.entity.postgresql';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostgreSQLEntity)
    private userRepository: Repository<UserPostgreSQLEntity>,
  ) {}

  async findAll(): Promise<UserPostgreSQLEntity[]> {
    return this.userRepository.find();
  }

  async create(user: UserPostgreSQLEntity): Promise<UserPostgreSQLEntity> {
    return this.userRepository.save(user);
  }
}