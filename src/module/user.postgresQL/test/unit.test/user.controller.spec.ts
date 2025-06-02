import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../user.service';
import { UserPostgreSQLEntity } from '../../../../entities/user.entity.postgresql';


const mockUserService = {
  findAll: jest.fn(),
  create: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
  const mockUsers: UserPostgreSQLEntity[] = [
        { id: 1, name: 'John', email: 'john@example.com', password: 'hashed123' },
        { id: 2, name: 'Jane', email: 'jane@example.com', password: 'hashed456' },
  ];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService, // Inject mock service
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks sau mỗi test
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {

      mockUserService.findAll.mockResolvedValue(mockUsers); // Mock service response

      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('should handle empty response', async () => {
      mockUserService.findAll.mockResolvedValue([]); // Mock empty array

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('POST /users', () => {
    it('should create and return a new user', async () => {
      const newUser: UserPostgreSQLEntity = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'plainPassword',
      };
      const savedUser: UserPostgreSQLEntity = {
        id: 3,
        ...newUser,
        password: 'hashed789', // Simulate hashed password
      };

      mockUserService.create.mockResolvedValue(savedUser); // Mock service response

      const result = await controller.create(newUser);
      expect(result).toEqual(savedUser);
      expect(mockUserService.create).toHaveBeenCalledWith(newUser);
    });

    it('should reject invalid user data', async () => {
      const invalidUser = { name: 'Bob' }; // Missing email and password

      mockUserService.create.mockRejectedValue(new Error('Invalid data'));

      await expect(controller.create(invalidUser as any)).rejects.toThrow('Invalid data');
    });
  });
});