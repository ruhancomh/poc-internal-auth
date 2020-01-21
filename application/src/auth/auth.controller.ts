import {Controller, Get, Param, Query, Req, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('login')
    async login(
        @Req() req,
        @Res() res,
        @Query('callback_url') callbackURL: string,
    ) {
        let loginInstance = await this.authService.createLoginInstance(callbackURL);
        return res.redirect(303, loginInstance.redirectURL);
    }

    @Get('oauth2/response')
    async processOAuth2Response(
        @Res() res,
        @Query('code') code: string,
        @Query('state') state: string,
        @Query( 'hd') hd: string
    ) {
        let processResponse = await this.authService.processOAuth2Response(code, state, hd);
        return res.redirect(303, processResponse.getRedirectURL());
    }

    @Get('validate')
    async validate(
        @Query( 'token') token: string
    ) {
        return this.authService.validateToken(token);
    }
}
