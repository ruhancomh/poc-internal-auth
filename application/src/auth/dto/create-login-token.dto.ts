export class CreateLoginTokenDto {
    user_id: string;

    constructor(user_id: string) {
        this.user_id = user_id;
    }
}