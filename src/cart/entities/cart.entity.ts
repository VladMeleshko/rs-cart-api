import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

// Entities
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderEntity } from '../../order/entities/order.entity';

@Entity('Carts')
export class CartEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(
    () => CartItemEntity,
    items => items.cart,
    {cascade: true}
  )
  items: CartItemEntity[];

  @OneToOne(() => UserEntity, user => user.cart)
  user: UserEntity;

  @OneToMany(
    () => OrderEntity,
    orders => orders.cart
  )
  orders: OrderEntity[];

  @CreateDateColumn({name: 'created_at', type: Date, nullable: false})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', type: Date, nullable: false})
  updatedAt: Date;
}