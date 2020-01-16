import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      MongooseModule.forRoot(`mongodb://${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`),
      AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

