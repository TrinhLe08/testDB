import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEnity } from 'src/entities/user.entity.mysql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEnity)
    private userRepository: Repository<UserEnity>,
  ) {}

  async findAll(): Promise<UserEnity[]> {
    return this.userRepository.find();
  }

  async create(user: UserEnity): Promise<UserEnity> {
    return this.userRepository.save(user);
  }
}