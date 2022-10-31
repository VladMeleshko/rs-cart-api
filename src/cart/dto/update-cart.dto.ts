import { IsString, IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  count: number;
}