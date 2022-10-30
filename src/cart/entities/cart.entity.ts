import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';
import { UserEntity } from 'src/users/entities/user.entity';

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

  @CreateDateColumn({name: 'created_at', type: Date, nullable: false})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', type: Date, nullable: false})
  updatedAt: Date;
}