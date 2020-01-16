export  class UpdateUserInfoDto {
    sub: string;
    email: string;
    name: string;
    picture: string;
    givenName: string;
    familyName: string;

    constructor(sub: string, email: string, name: string, picture: string, give_name: string, family_name: string) {
        this.sub = sub;
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.givenName = give_name;
        this.familyName = family_name;
    }
}