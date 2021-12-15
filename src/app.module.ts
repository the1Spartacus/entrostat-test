import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateOtpModule } from './generate-otp/generate-otp.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerateOtp } from './generate-otp/entities/generate-otp.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    GenerateOtpModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGODB_HOST,
      port: 27017,
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
      database: process.env.MONGODB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    TypeOrmModule.forFeature([GenerateOtp]),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
