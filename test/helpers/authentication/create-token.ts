import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { KeycloakUserInfoResponse } from '../../../src/authentication/authentication.strategy';

export function createToken(id: string = uuid(), username = 'john.doe'): string {
    const userInfos: KeycloakUserInfoResponse = {
        sub: id,
        email: `${username}@example.com`,
        email_verified: true,
        name: 'John doe',
        preferred_username: username,
        given_name: 'John',
        family_name: 'Doe',
    };

    return jwt.sign(userInfos, 'secret');
}
