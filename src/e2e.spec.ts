import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { createToken } from '../test/helpers/authentication/create-token';
import { AUTHENTICATION_STRATEGY_TOKEN } from './authentication/authentication.strategy';
import { FakeAuthenticationStrategy } from './authentication/strategy/fake.strategy';

describe('Hello E2E', () => {
    let app: INestApplication;
    let server: any;

    const token = createToken();

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                AppModule
            ],
        })
            .overrideProvider(AUTHENTICATION_STRATEGY_TOKEN).useClass(FakeAuthenticationStrategy)
            .compile();

        app = module.createNestApplication();
        await app.init();

        server = app.getHttpServer();
    });

    describe('GET /', () => {

        it('requires authentication', async () => {
            const response = await request(server)
                .get('/');

            expect(response.status).toEqual(401);
        });

        it('returns "Hello World!"', async () => {
            const response = await request(server)
                .get('/')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(200);
        });
    });
});
