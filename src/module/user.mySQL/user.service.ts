import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMySQLEnity } from 'src/entities/user.entity.mysql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserMySQLEnity)
    private userRepository: Repository<UserMySQLEnity>,
  ) {}

  async findAll(): Promise<UserMySQLEnity[]> {
    return this.userRepository.find();
  }

  async create(user: UserMySQLEnity): Promise<UserMySQLEnity> {
    return this.userRepository.save(user);
  }
}