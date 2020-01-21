import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

import * as helmet from 'helmet';
import * as rateLimit from 'fastify-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {cors: true}
    );

    app.use(helmet());
    app.register(rateLimit,{
        max: 100,
        timeWindow: '1 minute'
    });

    await app.listen(3000, '0.0.0.0');
}
bootstrap();
