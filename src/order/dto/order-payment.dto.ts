import { IsString, IsEnum, IsOptional } from 'class-validator';

// Types
import { PaymentType } from "../models"

export class OrderPaymentDto {
  @IsEnum(PaymentType)
  @IsOptional()
  type?: PaymentType;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  creditCard?: string;
}