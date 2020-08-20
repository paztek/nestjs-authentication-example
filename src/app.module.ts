import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
    imports: [
        AuthenticationModule,
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
    ],
})
export class AppModule {}
