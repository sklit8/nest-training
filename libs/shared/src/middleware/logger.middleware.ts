import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, body } = req;
        const startTime = Date.now();

        // 缓存原始的 res.send 方法
        const originalSend = res.send;

        // 替换 res.send 方法以捕获响应数据
        res.send = function (body) {
            res.locals.responseBody = body; // 保存响应数据到 res.locals
            return originalSend.apply(this, arguments);
        };

        res.on('finish', () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const responseBody = res.locals.responseBody;
            console.log(`Request: ${method} ${originalUrl} - Body: ${JSON.stringify(body)}`);
            console.log(`Response: ${res.statusCode} - ${JSON.stringify(responseBody)} - ${duration}ms`);
        });

        next();
    }
}
