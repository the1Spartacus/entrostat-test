import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('otps')
export class GenerateOtp {
  @ObjectIdColumn() id: ObjectID;
  @Column() email: string;
  @Column() otp: number;
  @Column({ default: false }) isExpired: boolean;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  CreateDate?: Date;
  @Column() UpdateDate?: Date;
  @Column() ttl: string;

  constructor(generateOtp?: Partial<GenerateOtp>) {
    Object.assign(this, generateOtp);
  }
}
