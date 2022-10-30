import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CartEntity } from 'src/cart/entities/cart.entity';

@Entity('Users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({name: 'name'})
  name: string;

  @Column({name: 'email', nullable: true})
  email: string;

  @Column({name: 'password', nullable: true})
  password: string

  @OneToOne(() => CartEntity, cart => cart.user, {nullable: true})
  @JoinColumn({name: 'cart_id'})
  cart: CartEntity;
}