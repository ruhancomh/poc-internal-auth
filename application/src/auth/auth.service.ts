import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LoginInstanceDto } from "./dto/login-instance.dto";
import { google } from 'googleapis';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import { CreateLoginTokenDto } from "./dto/create-login-token.dto";
import { JwtService } from "@nestjs/jwt";
import { ProcessOauth2ResponseDto } from "./dto/process-oauth2-response.dto";
import { LoginRequest } from "./interface/login-request.interface";
import { User } from "./interface/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { LoginRequestDto } from "./dto/login-request.dto";
import { UpdateUserInfoDto } from "./dto/update-user-info.dto";

@Injectable()
export class AuthService {
    trustedCallbackURL = [
        'http://localhost:3034/login'
    ];

    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('LoginRequest') private readonly loginRequestModel: Model<LoginRequest>,
        @InjectModel('User') private readonly userModel: Model<User>
    ) {
    }

    async createLoginInstance (callbackURL: string): Promise<LoginInstanceDto> {

        if(!this.isTrustedCallbackURL(callbackURL))
            throw new Error('URL de origem não habilitada.');

        let securityState = this.getSecurityState();
        let loginInstanceDto =  new LoginInstanceDto('google', this.getGoogleAuthUrl(securityState));

        let createdLoginRequest = new this.loginRequestModel(new LoginRequestDto(
            securityState,
            callbackURL,
            'painel'
        ));

        createdLoginRequest.save();

        return loginInstanceDto;
    }

    async processOAuth2Response (code: string, state: string, hd: string): Promise<ProcessOauth2ResponseDto> {

        if(hd != 'picpay.com')
            throw new Error('Dominio de e-mail não autorizado');

        let loginRequest = await this.loginRequestModel.findOne({state: state});

        if(!loginRequest)
            throw new Error('Nenhuma solcitação de login encontrada');

        let userData = await this.getGoogleOAuth2UserData(code);

        if(!userData)
            throw new Error('Código de autenticação inválido');

        this.updateUserInfo(new UpdateUserInfoDto(
            userData.getPayload().sub,
            userData.getPayload().email,
            userData.getPayload().name,
            userData.getPayload().picture,
            userData.getPayload().given_name,
            userData.getPayload().family_name
        ));

        let loginToken = this.createLoginToken(new CreateLoginTokenDto(userData.getPayload().sub));

        return new ProcessOauth2ResponseDto(
            'google',
            loginRequest.callbackURL,
            loginToken
        );
    }

    async validateToken (token: string) : Promise<User> {
        let jwtDecoded = this.jwtService.verify(token);

        if(!jwtDecoded)
            throw new Error('Token inválido');

        let user = this.getUser(jwtDecoded['user_id']);

        if (!user)
            throw new Error('Nenhum usuário encontrado para o token fornecdio');

        return user
    }

    private isTrustedCallbackURL(callbackURL: string) : boolean {
        console.log(callbackURL);

        return !!this.trustedCallbackURL.find(trusted => trusted == callbackURL);
    }

    private async getUser(userID: string) : Promise<User> | null {
        return this.userModel.findOne({sub: userID});
    }

    private async updateUserInfo (userInfo: UpdateUserInfoDto): Promise<void> {
        (new this.userModel(userInfo)).save();
    }

    private getSecurityState(): string {
        return Date.now().toString();
    }

    private createLoginToken (createLoginTokenDto: CreateLoginTokenDto): string {
       return this.jwtService.sign({
           user_id: createLoginTokenDto.user_id
       });
    }

    private async getGoogleOAuth2UserData (code: string) : Promise<LoginTicket> {
        let googleOAuth2Client = this.getGoogleOAuth2Client();
        let {tokens} = await googleOAuth2Client.getToken(code);
        googleOAuth2Client.setCredentials(tokens);

        let userData =  await googleOAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_OAUTH2_CLIENT_ID
        });

        return userData;
    }

    private getGoogleOAuth2Client () : OAuth2Client {
        return new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH2_CLIENT_ID,
            process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH2_REDIRECT_URL,
        );
    }

    private getGoogleAuthUrl (securityState: string) : string {
        return this.getGoogleOAuth2Client()
            .generateAuthUrl({
                access_type: 'online',
                scope: this.getGoogleAuthScopes(),
                hd: 'picpay.com',
                state: securityState,
                prompt: 'select_account',
            })
    }

    private getGoogleAuthScopes () : Array<string> {
        return [
            'openid',
            'email',
            'profile'
        ];
    }
}
