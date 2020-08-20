import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('App');

    logger.log('Starting app...');
    const app = await NestFactory.create(AppModule);

    const port = parseInt(process.env.NODE_PORT, 10) || 3000;
    await app.listen(port);

    logger.log(`App started on port ${port}...`);
}
bootstrap();
