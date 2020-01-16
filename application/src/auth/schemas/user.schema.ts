import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    sub: String,
    email: String,
    name: String,
    picture: String,
    givenName: String,
    familyName: String,
});