import { HttpService, Injectable } from '@nestjs/common';

import { User } from './user.model';

export type AccessToken = string;

interface KeycloakUserInfoResponse {
    sub: string;
    email_verified: boolean;
    name:string;
    preferred_username: string;
    given_name: string;
    family_name: string,
    email: string;
}

export class AuthenticationError extends Error {}

@Injectable()
export class AuthenticationService {

    private readonly baseURL: string;
    private readonly realm: string;

    constructor(
        private httpService: HttpService,
    ) {
        this.baseURL = process.env.KEYCLOAK_BASE_URL;
        this.realm = process.env.KEYCLOAK_REALM;
    }

    /**
     * Call the OpenId Connect UserInfo endpoint on Keycloak: https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
     *
     * If it succeeds, the token is valid and we get the user infos in the response
     * If it fails, the token is invalid or expired
     */
    async authenticate(accessToken: AccessToken): Promise<User> {
        const url = `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/userinfo`;

        try {
            const response = await this.httpService.get<KeycloakUserInfoResponse>(url, {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            }).toPromise();

            return {
                id: response.data.sub,
                username: response.data.preferred_username,
            };
        } catch (e) {
            throw new AuthenticationError(e.message);
        }
    }
}
