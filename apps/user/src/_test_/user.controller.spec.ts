import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from 'shared/src/guard/jwt.guard';
import { User } from 'shared/src/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {UserController} from "../user.controller";
import {UserService} from "../user.service";

const mockUserService = () => ({
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  addUser: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
        .overrideGuard(JwtGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should get a user by username', async () => {
      const username = 'testuser';
      const result = { username: 'testuser' };
      jest.spyOn(service, 'getUser').mockResolvedValue(result);

      expect(await controller.getUser(username)).toEqual(result);
    });
  });

  describe('updateUser', () => {
    it('should update a user by username', async () => {
      const username = 'testuser';
      const user: User = {
        id: 1,
        username: 'testuser',
        password: 'password',
        firstName: 'First',
        lastName: 'Last',
        email: 'test@test.com',
        phone: '1234567890',
        userStatus: 0,
      };
      const result = { ...user, password: 'newpassword' };
      jest.spyOn(service, 'updateUser').mockResolvedValue(result);

      expect(await controller.updateUser(user, username)).toEqual(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by username', async () => {
      const username = 'testuser';
      const result = { affected: 1 };
      jest.spyOn(service, 'deleteUser').mockResolvedValue(result);

      expect(await controller.deleteUser(username)).toEqual(result);
    });
  });

  describe('addUser', () => {
    it('should add a new user', async () => {
      const user: User = {
        id: 1,
        username: 'newuser',
        password: 'password',
        firstName: 'First',
        lastName: 'Last',
        email: 'new@test.com',
        phone: '1234567890',
        userStatus: 0,
      };
      const result = { id: 1, ...user };
      jest.spyOn(service, 'addUser').mockResolvedValue(result);

      expect(await controller.addUser(user)).toEqual(result);
    });
  });
});
