import { Injectable, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { UserPostgreSQLEntity } from './../../entities/user.entity.postgresql';
import { JwtService } from 'src/global/gobalJwt';
import { RabbitMQService } from '../rabbitMQ/rabbitmq.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserPostgreSQLEntity)
    private userRepository: Repository<UserPostgreSQLEntity>,
    private readonly jwtService: JwtService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly moduleRef: ModuleRef
  ) {}

  async findAll(): Promise<UserPostgreSQLEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserPostgreSQLEntity> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async login(email: string, password : string ) : Promise<any> {
    try {
      const checkInformationUserByEmail = await this.findByEmail(email);
      if (checkInformationUserByEmail && checkInformationUserByEmail.password == password) {
        const payload = {checkInformationUserByEmail}
        const token = this.jwtService.sign(payload)
        return new ResponseData<{acccessToken : string}>(
          {acccessToken : token},
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<string>(
          'Wrong Information',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch(err) {
      console.log(err);
       return new ResponseData<string>(
          'Wrong Information',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
    }
  }

  async create(user: any): Promise<Partial<any>> {
      if (!user.email || !user.password) {
    throw new BadRequestException('Email and password are required');
  }
  const createdUser = await this.userRepository.save(user);
  const { password, ...result } = createdUser;
  return result;
}

 async onModuleInit() {
    const rabbitMQService = await this.moduleRef.get(RabbitMQService, { strict: false });
     await rabbitMQService.consumeReceiveToQueue('user_queue', async (msg) => {
      try {
        const buffer = Buffer.from(msg.data)
        const jsonString = buffer.toString('utf-8');
        console.log(jsonString);

        const jsonObject = JSON.parse(jsonString);
        console.log("Received:",jsonObject);
        
        return true; // Ack message
      } catch (error) {
        console.error('Error processing message:', error);
        return false; // Nack message
      }
    },);
    return ;
  }
}