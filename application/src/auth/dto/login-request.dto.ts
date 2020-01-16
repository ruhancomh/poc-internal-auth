export class LoginRequestDto {
    state: string;
    callbackURL: string;
    origin: string;

    constructor(state: string, callbackURL: string, origin: string) {
        this.state = state;
        this.callbackURL = callbackURL;
        this.origin = origin;
    }
}