import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { LessThan, MongoRepository, ObjectID, Raw } from 'typeorm';
import { CreateGenerateOtpDto } from './dto/create-generate-otp.dto';
import { UpdateGenerateOtpDto } from './dto/update-generate-otp.dto';
import { GenerateOtp } from './entities/generate-otp.entity';
// const cron = require('node-cron');

@Injectable()
export class GenerateOtpService {
  constructor(
    @InjectRepository(GenerateOtp)
    private readonly generateOtpRepository: MongoRepository<GenerateOtp>,
    private mailService: MailService
  ) {}

  async create(generateOtp: Partial<GenerateOtp>) {
    if (!generateOtp || !generateOtp.email || !generateOtp.otp) {
      throw new BadRequestException(
        `Generate OTP must have at least email and otp defined`,
      );
    }
    return await this.generateOtpRepository.save(new GenerateOtp(generateOtp));
  }

  findAll() {
    return `This action returns all generateOtp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generateOtp`;
  }

  update(id: number, updateGenerateOtpDto: UpdateGenerateOtpDto) {
    return `This action updates a #${id} generateOtp`;
  }

  remove(id: number) {
    return `This action removes a #${id} generateOtp`;
  }
  // Function to generate OTP
  async generateOTP(email: string) {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log('OTP of 6 digits: ', OTP);

    const otpRecs = await this.generateOtpRepository.find({
      where: {
        email: email,
        otp: OTP,
      },
    });

    if (otpRecs.length == 0) {
      // check if this email has requested otp in less than an hour ago
      this.otpRequestLimit(email, +OTP);
    } else {
      // generate new otp
      this.generateOTP(email);
    }
  }

  async otpRequestLimit(email: string, otp: number) {
    const reqData: GenerateOtp = {
      email: email,
      otp: otp,
      id: new ObjectID(),
      isExpired: false,
      ttl: '',
    };

    const intHours = 1;
    const date: Date = this.subtractTimeFromDate(intHours);
    const rec = await this.generateOtpRepository.find({
      where: {
        email: email,
        CreateDate: Raw((alias) => `${alias} <= :date`, { date: date }),
      },
    });

    if (rec.length < 3) {
      await this.create(reqData);
      await this.mailService.sendOtp(reqData.email, reqData.otp);
    } else {
      console.log(`this ${email} can not request otp at the moment`);
    }
  }
  subtractTimeFromDate(intHours: number) {
    const objDate = new Date();
    const numberOfMlSeconds = objDate.getTime();
    const hoursInMlSeconds = intHours * 60 * 60 * 1000;
    const newDateObj = new Date(numberOfMlSeconds - hoursInMlSeconds);

    return newDateObj;
  }

  async updateOTPExpiry(status: boolean, email?: string, id?: ObjectID) {
    return await this.generateOtpRepository.update(
      {
        id: id,
        email: email,
      },
      {
        isExpired: status,
      },
    );
  }

  async requestResentOtp(email: string) {
    const resentMinutes = 5;
    const letestRec = await this.generateOtpRepository.findOne({
      where: {
        email: email,
      },
    });

    const diff = Math.abs(letestRec.CreateDate.getTime() - Date.now());
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < resentMinutes) {
      this.updateOTPExpiry(false, letestRec.email, letestRec.id);
      // then send otp
      await this.mailService.sendOtp(letestRec.email, letestRec.otp);
    } else {
      // generate new otp
      this.generateOTP(email);
    }
  }
  // const expiryTimeInSec = 30;
  async updateOtpStatus(email: string) {
    const rec = await this.generateOtpRepository.find({
      where: {
        email: email,
        isExpired: 0,
      },
    });

    if (rec.length > 0) {
      rec.sort((a, b) => b.CreateDate.getTime() - a.CreateDate.getTime());
      // grab/slice the latest
      const lastRec = rec.slice(0, 1);

      this.updateOTPExpiry(true, lastRec[0].email, lastRec[0].id);
    } else {
      console.log(`there is nothing to update for ${email}`);
    }
  }
  // Function to validate OTP
  async validateOTP(email: string, otp: number) {
    const rec = await this.generateOtpRepository.find({
      where: {
        email: email,
        otp: otp,
      },
    });

    if (rec.length > 0) {
      rec.sort((a, b) => b.CreateDate.getTime() - a.CreateDate.getTime());
      // grab/slice the latest
      const lastRec = rec.slice(0, 1);

      if (lastRec[0].isExpired == false) {
        // return a successfull message and update expiry
        this.updateOTPExpiry(true, lastRec[0].email, lastRec[0].id);
      } else {
        console.log(`otp has expired`);
      }
    } else {
      console.log(`email or otp is invalid`);
    }
  }
}
