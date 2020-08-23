import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';

import { AuthenticationStrategy, KeycloakUserInfoResponse } from '../authentication.strategy';

export class InvalidTokenPublicKeyId extends Error {
    constructor(keyId: string) {
        super(`Invalid public key ID ${keyId}`);
    }
}

/**
 * Format of the keys returned in the JSON response from Keycloak for the list of public keys
 */
interface KeycloakCertsResponse {
    keys: KeycloakKey[];
}
interface KeycloakKey {
    kid: KeyId;
    x5c: PublicKey;
}
type KeyId = string;
type PublicKey = string;

@Injectable()
export class ManualAuthenticationStrategy implements AuthenticationStrategy {

    /**
     * Keep an in-memory map of the known public keys to avoid calling Keycloak every time
     */
    private readonly keysMap: Map<KeyId, PublicKey> = new Map<KeyId, PublicKey>();

    private readonly baseURL: string;
    private readonly realm: string;

    constructor(
        private httpService: HttpService,
    ) {
        this.baseURL = process.env.KEYCLOAK_BASE_URL;
        this.realm = process.env.KEYCLOAK_REALM;
    }

    public async authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
        const token = jwt.decode(accessToken, { complete: true }); // For once, we'd like to have the header and not just the payload

        const keyId = token.header.kid;

        const publicKey = await this.getPublicKey(keyId);

        return jwt.verify(accessToken, publicKey);
    }

    private async getPublicKey(keyId: KeyId): Promise<PublicKey> {
        if (this.keysMap.has(keyId)) {
            return this.keysMap.get(keyId);
        } else {
            const keys = await this.httpService.get<KeycloakCertsResponse>(`${this.baseURL}/realms/${this.realm}/protocol/openid-connect/certs`)
                .pipe(map((response) => response.data.keys))
                .toPromise();

            const key = keys.find((k) => k.kid === keyId);

            if (key) {
                const publicKey =
                    `
-----BEGIN CERTIFICATE-----
${key.x5c}
-----END CERTIFICATE-----
`;
                this.keysMap.set(keyId, publicKey);

                return publicKey;
            } else {
                // Token is probably so old, Keycloak doesn't even advertise the corresponding public key anymore
                throw new InvalidTokenPublicKeyId(keyId);
            }
        }
    }
}
