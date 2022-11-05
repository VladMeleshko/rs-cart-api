import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

// Types
import { OrderDelivery, OrderPayment } from '../models';

// Entities
import { CartEntity } from '../../cart/entities/cart.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from '../../cart/entities/cart-item.entity';

@Entity('Orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(
    () => CartEntity,
    cart => cart.orders
  )
  @JoinColumn({name: 'cart_id'})
  cart: CartEntity;

  @ManyToOne(
    () => UserEntity,
    user => user.orders
  )
  @JoinColumn({name: 'user_id'})
  user: UserEntity;

  @Column({type: 'jsonb'})
  items: CartItemEntity[];

  @Column({type: 'jsonb'})
  payment: OrderPayment;
  
  @Column({type: 'jsonb'})
  delivery: OrderDelivery;

  @Column({nullable: true})
  comments: string;

  @Column()
  status: string;

  @Column()
  total: number;
}