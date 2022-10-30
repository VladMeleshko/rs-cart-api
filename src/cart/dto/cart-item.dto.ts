import { IsString, IsNumber } from 'class-validator';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  count: number;
}