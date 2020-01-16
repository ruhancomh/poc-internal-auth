export class LoginInstanceDto {
    type: string;
    redirectURL: string;

    constructor(type: string, redirectURL: string) {
        this.type = type;
        this.redirectURL = redirectURL;
    }
}