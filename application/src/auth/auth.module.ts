import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constantes";
import { MongooseModule } from "@nestjs/mongoose";
import { LoginRequestSchema } from "./schemas/login-request.schema";
import { UserSchema } from "./schemas/user.schema";

@Module({
  imports: [
      JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: {
              expiresIn: 1200
          }
      }),
      MongooseModule.forFeature([
          { name: 'LoginRequest', schema: LoginRequestSchema },
          { name: 'User', schema: UserSchema },
      ]),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
