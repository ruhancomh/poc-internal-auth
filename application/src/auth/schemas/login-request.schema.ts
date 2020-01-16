import * as mongoose from 'mongoose';

export const LoginRequestSchema = new mongoose.Schema({
    state: String,
    callbackURL: String,
    origin: String
}, {collection: 'login_request'});