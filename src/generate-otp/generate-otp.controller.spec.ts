import { Test, TestingModule } from '@nestjs/testing';
import { GenerateOtpController } from './generate-otp.controller';
import { GenerateOtpService } from './generate-otp.service';

describe('GenerateOtpController', () => {
  let controller: GenerateOtpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateOtpController],
      providers: [GenerateOtpService],
    }).compile();

    controller = module.get<GenerateOtpController>(GenerateOtpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
