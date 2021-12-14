import { PartialType } from '@nestjs/mapped-types';
import { CreateGenerateOtpDto } from './create-generate-otp.dto';

export class UpdateGenerateOtpDto extends PartialType(CreateGenerateOtpDto) {}
