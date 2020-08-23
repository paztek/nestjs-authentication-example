import { HttpService, Injectable } from '@nestjs/common';

import { AuthenticationStrategy, KeycloakUserInfoResponse } from '../authentication.strategy';

@Injectable()
export class KeycloakAuthenticationStrategy implements AuthenticationStrategy {

    private readonly baseURL: string;
    private readonly realm: string;

    constructor(
        private readonly httpService: HttpService,
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
    async authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
        const url = `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/userinfo`;

        const response = await this.httpService.get<KeycloakUserInfoResponse>(url, {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        }).toPromise();

        return response.data;
    }

}
