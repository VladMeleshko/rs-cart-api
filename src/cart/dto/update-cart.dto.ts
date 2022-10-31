import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTOs
import { CartItemDto } from './cart-item.dto';

export class UpdateCartDto {
  @ValidateNested()
  @Type(() => CartItemDto)
  items: CartItemDto[];
}