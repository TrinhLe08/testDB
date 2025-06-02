import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user.service';
import { UserPostgreSQLEntity } from '../../../../entities/user.entity.postgresql';


describe('UserService (Integration)', () => {
  let service: UserService;
  let repository: Repository<UserPostgreSQLEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserPostgreSQLEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserPostgreSQLEntity]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserPostgreSQLEntity>>(
      getRepositoryToken(UserPostgreSQLEntity),
    );
  });

  afterAll(async () => {
    await repository.manager.connection.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe('create()', () => {
    it('should save user with hashed password', async () => {
      const user = await service.create({
        id : 1,
        name: 'Test',
        email: 'test@test.com',
        password: 'plain',
      });

      expect(user.password).not.toBe('plain');
      const dbUser = await repository.findOneBy({ email: 'test@test.com' });
      expect(dbUser).toBeDefined();
    });
  });

  describe('findAll()', () => {
    it('should return users without passwords', async () => {
      await repository.save([
        { name: 'User1', email: 'u1@test.com', password: 'p1' },
        { name: 'User2', email: 'u2@test.com', password: 'p2' },
      ]);

      const users = await service.findAll();
      expect(users).toHaveLength(2);
      expect(users[0].password).toBeUndefined();
    });
  });
});