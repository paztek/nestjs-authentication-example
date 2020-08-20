import { HttpModule, Module } from '@nestjs/common';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        AuthenticationGuard,
        AuthenticationService,
    ],
    exports: [
        AuthenticationService,
    ],
})
export class AuthenticationModule {}
