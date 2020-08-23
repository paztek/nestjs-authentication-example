import { Inject, Injectable, Logger } from '@nestjs/common';

import { User } from './user.model';
import { AUTHENTICATION_STRATEGY_TOKEN, AuthenticationStrategy } from './authentication.strategy';

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {

    private logger = new Logger(AuthenticationService.name);

    constructor(
        @Inject(AUTHENTICATION_STRATEGY_TOKEN) private readonly strategy: AuthenticationStrategy,
    ) {}

    async authenticate(accessToken: string): Promise<User> {
        try {
            const userInfos = await this.strategy.authenticate(accessToken);

            const user = {
                id: userInfos.sub,
                username: userInfos.preferred_username,
            };

            /**
             * Perform any addition business logic with the user:
             * - insert user in "users" table on first authentication,
             * - etc.
             */

            return user;
        } catch (e) {
            this.logger.error(e.message, e.stackTrace);
            throw new AuthenticationError(e.message);
        }
    }
}
