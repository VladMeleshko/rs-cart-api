import { IsEnum, IsString } from 'class-validator';

// Types
import { DeliveryType } from "../models"

export class OrderDeliveryDto {
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @IsString()
  address: string;
}