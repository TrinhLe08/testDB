import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPostgresQLEnity } from 'src/entities/user.entity.postgresql';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostgresQLEnity)
    private userRepository: Repository<UserPostgresQLEnity>,
  ) {}

  async findAll(): Promise<UserPostgresQLEnity[]> {
    return this.userRepository.find();
  }

  async create(user: UserPostgresQLEnity): Promise<UserPostgresQLEnity> {
    return this.userRepository.save(user);
  }
}