import { Module } from '@nestjs/common';
import { GenerateOtpService } from './generate-otp.service';
import { GenerateOtpController } from './generate-otp.controller';

@Module({
  controllers: [GenerateOtpController],
  providers: [GenerateOtpService]
})
export class GenerateOtpModule {}
