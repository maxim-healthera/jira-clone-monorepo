import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CommonUserVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: string;
}