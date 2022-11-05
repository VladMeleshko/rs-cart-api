import { ValidateNested, IsEnum, IsArray, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// DTOs
import { OrderDeliveryDto } from './order-delivery.dto';
import { OrderPaymentDto } from './order-payment.dto';

// Types
import { OrderStatuses } from "../models";

// Entities
import { CartItemEntity } from '../../cart/entities/cart-item.entity';

export class UpdateOrderDto {
  @IsArray()
  items: CartItemEntity[]
  
  @IsNumber()
  total: number;

  @ValidateNested()
  @Type(() => OrderPaymentDto)
  payment: OrderPaymentDto;

  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  delivery: OrderDeliveryDto;
    
  @IsOptional()
  @IsString()
  comments: string;

  @IsEnum(OrderStatuses)
  status: OrderStatuses;
}