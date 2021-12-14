import { Test, TestingModule } from '@nestjs/testing';
import { GenerateOtpService } from './generate-otp.service';

describe('GenerateOtpService', () => {
  let service: GenerateOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateOtpService],
    }).compile();

    service = module.get<GenerateOtpService>(GenerateOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
