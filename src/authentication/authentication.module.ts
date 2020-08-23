import { HttpModule, Module } from '@nestjs/common';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { AUTHENTICATION_STRATEGY_TOKEN } from './authentication.strategy';
import { ManualAuthenticationStrategy } from './strategy/manual.strategy';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        AuthenticationGuard,
        AuthenticationService,
        {
            provide: AUTHENTICATION_STRATEGY_TOKEN,
            useClass: ManualAuthenticationStrategy,
        },
    ],
    exports: [
        AuthenticationService,
    ],
})
export class AuthenticationModule {}
