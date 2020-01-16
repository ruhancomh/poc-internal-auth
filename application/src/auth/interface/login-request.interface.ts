export interface LoginRequest {
    state: string;
    callbackURL: string;
    origin: string;
}