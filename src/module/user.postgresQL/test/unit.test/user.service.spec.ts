import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user.service';
import { UserPostgreSQLEntity } from '../../../../entities/user.entity.postgresql';

describe('UserService', () => { 
  let service: UserService;
  let userRepository: Repository<UserPostgreSQLEntity>;

  // Mock data
  const mockUsers: UserPostgreSQLEntity[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'hashed123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'hashed456' },
  ];

    const newUser: UserPostgreSQLEntity = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    password: 'hashed789'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserPostgreSQLEntity),
          useValue: {
            find: jest.fn(),
            save: jest.fn().mockImplementation((user) => {
              return Promise.resolve({
                id: Math.floor(Math.random() * 1000),
                ...user
              });
            }),
          },
        },
      ],
    }).compile();

  service = module.get<UserService>(UserService);
  userRepository = module.get<Repository<UserPostgreSQLEntity>>(
      getRepositoryToken(UserPostgreSQLEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks sau mỗi test
  });

  describe('findAll()', () => {
   it('should return an array of users', async () => {
  // 1. Chuẩn bị mock
    jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

  // 2. Thực thi
    const result = await service.findAll();

  // 3. Kiểm tra
    expect(result).toEqual(mockUsers);
    expect(userRepository.find).toHaveBeenCalled();
  });

   it('should return empty array if no users found', async () => {
  // 1. Chuẩn bị mock
    jest.spyOn(userRepository, 'find').mockResolvedValue([]);

  // 2. Thực thi
    const result = await service.findAll();

  // 3. Kiểm tra
    expect(result).toEqual([]);
 });
});

  describe('create()', () => {
    it('should create and return a new user', async () => {
      const result = await service.create(newUser);
      
      expect(result).toEqual(expect.objectContaining(newUser));
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(typeof result.id).toBe('number');
    });

    it('should throw error when repository fails', async () => {
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(service.create(newUser)).rejects.toThrow('Database error');
    });
  });
});