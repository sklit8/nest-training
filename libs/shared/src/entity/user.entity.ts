import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {IsEmail, IsInt, IsPhoneNumber, IsString} from "class-validator";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column()
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column()
  @IsString()
  @IsPhoneNumber("CN")
  phone: string;

  @Column()
  @IsInt()
  userStatus: number;
}