import { IsString, IsEnum, IsOptional } from 'class-validator';

// Types
import { PaymentType } from "../models"

export class OrderPaymentDto {
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  creditCard?: string;
}