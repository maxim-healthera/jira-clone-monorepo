import { IsString } from "class-validator";

export class CommonVerifyUserDto {
  @IsString()
  token: string;
}