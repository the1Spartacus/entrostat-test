import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GenerateOtpService } from './generate-otp.service';
import { CreateGenerateOtpDto } from './dto/create-generate-otp.dto';
import { UpdateGenerateOtpDto } from './dto/update-generate-otp.dto';

@Controller('generate-otp')
export class GenerateOtpController {
  constructor(private readonly generateOtpService: GenerateOtpService) {}

  @Post()
  create(@Body() createGenerateOtpDto: CreateGenerateOtpDto) {
    return this.generateOtpService.create(createGenerateOtpDto);
  }

  @Get()
  findAll() {
    return this.generateOtpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generateOtpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGenerateOtpDto: UpdateGenerateOtpDto) {
    return this.generateOtpService.update(+id, updateGenerateOtpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generateOtpService.remove(+id);
  }
}
