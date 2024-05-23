import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'shared/src/entity/user.entity';
import { NotAcceptableException } from '@nestjs/common';
import {UserService} from "../user.service";

const mockUserRepository = () => ({
  findOne: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should get a user by username', async () => {
      const username = 'testuser';
      const result = { username: 'testuser' };
      userRepository.findOne.mockResolvedValue(result);

      expect(await service.getUser(username)).toEqual(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by username', async () => {
      const username = 'testuser';
      const user = { username: 'testuser' };
      userRepository.findOne.mockResolvedValue(user);
      userRepository.remove.mockResolvedValue(user);

      expect(await service.deleteUser(username)).toEqual(user);
    });

    it('should throw an error if the user does not exist', async () => {
      const username = 'testuser';
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUser(username)).rejects.toThrow(NotAcceptableException);
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
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(user);

      expect(await service.addUser(user)).toEqual(user);
    });

    it('should throw an error if the user already exists', async () => {
      const user: User = {
        id: 1,
        username: 'existinguser',
        password: 'password',
        firstName: 'First',
        lastName: 'Last',
        email: 'existing@test.com',
        phone: '1234567890',
        userStatus: 0,
      };
      userRepository.findOne.mockResolvedValue(user);

      await expect(service.addUser(user)).rejects.toThrow(NotAcceptableException);
    });
  });

  describe('updateUser', () => {
    it('should update a user by username', async () => {
      const username = 'testuser';
      const oldUser = {
        id: 1,
        username: 'testuser',
        password: 'oldpassword',
        firstName: 'Old',
        lastName: 'User',
        email: 'old@test.com',
        phone: '1234567890',
        userStatus: 0,
      };
      const newUser = {
        id: 1,
        username: 'testuser',
        password: 'newpassword',
        firstName: 'New',
        lastName: 'User',
        email: 'new@test.com',
        phone: '0987654321',
        userStatus: 0,
      };
      userRepository.findOne.mockResolvedValue(oldUser);
      userRepository.save.mockResolvedValue(newUser);

      expect(await service.updateUser(username, newUser)).toEqual(newUser);
    });

    it('should throw an error if the user does not exist', async () => {
      const username = 'nonexistentuser';
      const user: User = {
        id: 1,
        username: 'nonexistentuser',
        password: 'password',
        firstName: 'Non',
        lastName: 'Existent',
        email: 'nonexistent@test.com',
        phone: '1234567890',
        userStatus: 0,
      };
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(username, user)).rejects.toThrow(NotAcceptableException);
    });
  });
});
