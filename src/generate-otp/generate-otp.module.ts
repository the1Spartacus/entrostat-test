import { Module } from '@nestjs/common';
import { GenerateOtpService } from './generate-otp.service';
import { GenerateOtpController } from './generate-otp.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[MailModule],
  controllers: [GenerateOtpController],
  providers: [GenerateOtpService]
})
export class GenerateOtpModule {}
