import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class AddressDto {
  @IsString()
  country: string;
}

export abstract class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  timezone: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: any;
}
