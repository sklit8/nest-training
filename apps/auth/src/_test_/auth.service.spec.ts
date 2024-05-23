import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'shared/src/entity/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AuthDto } from 'shared/src/entity/auth.authDto';
import {AuthService} from "../auth.service";

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepository;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw an UnauthorizedException if the user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login('test', 'test')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      userRepository.findOne.mockResolvedValue({ username: 'test', password: 'wrong' });

      await expect(service.login('test', 'test')).rejects.toThrow(UnauthorizedException);
    });

    it('should return a JWT token if credentials are valid', async () => {
      const user = { id: 1, username: 'test', password: 'test' };
      userRepository.findOne.mockResolvedValue(user);
      const token = 'jwt-token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.login('test', 'test');
      expect(result).toEqual(token);
    });
  });

  describe('register', () => {
    it('should throw an UnauthorizedException if the username already exists', async () => {
      userRepository.findOne.mockResolvedValue({ username: 'test' });

      const payload: AuthDto = {
        username: 'test',
        password: 'test',
        checkPassword: 'test',
        firstName: 'First',
        lastName: 'Last',
        email: 'test@test.com',
        phone: '1234567890',
      };

      await expect(service.register(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should return "error" if passwords do not match', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const payload: AuthDto = {
        username: 'test',
        password: 'test1',
        checkPassword: 'test2',
        firstName: 'First',
        lastName: 'Last',
        email: 'test@test.com',
        phone: '1234567890',
      };

      const result = await service.register(payload);
      expect(result).toEqual('error');
    });

    it('should save the new user and return "ok" if registration is successful', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(true);

      const payload: AuthDto = {
        username: 'test',
        password: 'test',
        checkPassword: 'test',
        firstName: 'First',
        lastName: 'Last',
        email: 'test@test.com',
        phone: '1234567890',
      };

      const result = await service.register(payload);
      expect(result).toEqual('ok');
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        username: 'test',
        password: 'test',
        firstName: 'First',
        lastName: 'Last',
        email: 'test@test.com',
        phone: '1234567890',
      }));
    });
  });
});
