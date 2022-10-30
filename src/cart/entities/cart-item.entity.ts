import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('Cart_items')
export class CartItemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, {nullable: false})
  @JoinColumn({name: 'cart_id'})
  cart: CartEntity;

  @Column({name: 'product_id'})
  productId: string;

  @Column({name: 'count'})
  count: number;
}