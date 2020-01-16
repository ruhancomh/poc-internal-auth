export class ProcessOauth2ResponseDto {
    type: string;
    callbackURL: string;
    loginToken: string;

    constructor(type: string, callbackURL: string, loginToken: string) {
        this.type = type;
        this.callbackURL = callbackURL;
        this.loginToken = loginToken;
    }

    public getRedirectURL(): string {
        return `${this.callbackURL}?token=${this.loginToken}`;
    }
}