import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthDto } from 'shared/src/entity/auth.authDto';
import {AuthController} from "../auth.controller";

const mockAuthService = () => ({
  login: jest.fn(),
  register: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const loginDto: AuthDto = {
        username: 'testuser',
        password: 'password',
        checkPassword: 'password',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        phone: '1234567890',
      };
      const token = 'jwt-token';
      jest.spyOn(authService, 'login').mockResolvedValue(token);

      expect(await controller.login(loginDto)).toEqual({ access_token: token });
      expect(authService.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });
  });

  describe('register', () => {
    it('should call the register method', async () => {
      const registerDto: AuthDto = {
        username: 'newuser',
        password: 'password',
        checkPassword: 'password',
        firstName: 'First',
        lastName: 'Last',
        email: 'new@test.com',
        phone: '1234567890',
      };
      const result = 'ok';
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('logout', () => {
    it('should return null', () => {
      expect(controller.logout()).toBeNull();
    });
  });
});
