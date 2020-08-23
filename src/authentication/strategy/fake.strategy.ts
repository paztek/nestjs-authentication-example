import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { AuthenticationStrategy, KeycloakUserInfoResponse } from '../authentication.strategy';

@Injectable()
export class FakeAuthenticationStrategy implements AuthenticationStrategy {

    /**
     * Blindly trust the JWT, assume it has the Keycloak structure and return the decoded payload
     */
    public authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
        return Promise.resolve(jwt.decode(accessToken));
    }
}
