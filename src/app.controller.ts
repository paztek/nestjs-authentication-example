import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AuthenticationGuard } from './authentication/authentication.guard';

@UseGuards(AuthenticationGuard)
@Controller()
export class AppController {

    constructor(
        private readonly appService: AppService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
