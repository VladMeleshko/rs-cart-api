import { IsOptional, IsEnum, IsString } from 'class-validator';

// Types
import { DeliveryType } from "../models"

export class OrderDeliveryDto {
  @IsOptional()
  @IsEnum(DeliveryType)
  type?: DeliveryType;

  @IsString()
  address: string;
}