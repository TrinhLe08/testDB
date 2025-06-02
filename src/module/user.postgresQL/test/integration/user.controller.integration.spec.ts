import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from '../../../../app.module';
import { UserPostgreSQLEntity } from '../../../../entities/user.entity.postgresql';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';

describe('UserController (Integration)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserPostgreSQLEntity>;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, 
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserPostgreSQLEntity],
          synchronize: true, // Tự động tạo bảng
        }),
        TypeOrmModule.forFeature([UserPostgreSQLEntity]),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    userRepository = module.get<Repository<UserPostgreSQLEntity>>(
      getRepositoryToken(UserPostgreSQLEntity),
    );
    userService = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.clear(); // Xóa dữ liệu cũ trước mỗi test
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      // 1. Chuẩn bị dữ liệu test trong database
      await userRepository.save([
        { name: 'User1', email: 'user1@test.com', password: 'hashed1' },
        { name: 'User2', email: 'user2@test.com', password: 'hashed2' },
      ]);

      // 2. Gọi API thật
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      // 3. Kiểm tra kết quả
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'User1', email: 'user1@test.com' }),
          expect.objectContaining({ name: 'User2', email: 'user2@test.com' }),
        ]),
      );
      expect(response.body[0].password).toBeUndefined(); // Đảm bảo không trả về password
    });

    it('should return empty array if no users exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'NewUser',
        email: 'new@test.com',
        password: 'P@ssw0rd',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      // Kiểm tra response
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: newUser.name,
          email: newUser.email,
        }),
      );
      expect(response.body.password).toBeUndefined();

      // Kiểm tra dữ liệu trong database
      const userInDb = await userRepository.findOneBy({ email: newUser.email });
      expect(userInDb).toMatchObject({
        name: newUser.name,
        email: newUser.email,
      });
      expect(userInDb.password).not.toBe(newUser.password); // Password phải được mã hóa
    });

    it('should return 400 for invalid data', async () => {
      const invalidUser = { name: 'A' }; // Thiếu email và password

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.message).toContain('Email and password are required');
    });
  });
});