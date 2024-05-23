import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {User} from "shared/src/entity/user.entity";
import {JwtStrategy} from "shared/src/guard/jwt.strategy";
import {LoggerMiddleware} from "shared/middleware/logger.middleware";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {ResponseInterceptor} from "shared/interceptors/response.interceptor";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DATABASE_HOST', 'localhost'),
                port: configService.get<number>('DATABASE_PORT', 5432),
                username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
                password: configService.get<string>('DATABASE_PASSWORD', 'luo147258'),
                database: configService.get<string>('DATABASE_NAME', 'mydb'),
                entities: [User],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        JwtStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware) // 应用日志中间件
            .forRoutes({path: '*', method: RequestMethod.ALL}); // 对所有路由生效
    }
}
