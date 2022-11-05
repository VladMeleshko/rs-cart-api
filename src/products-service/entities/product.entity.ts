import { PrimaryColumn, Entity, Column, OneToOne } from 'typeorm';

// Entities
import { StockEntity } from './stock.entity';

@Entity('Products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({name: 'title'})
  title: string

  @Column({name: 'description', nullable: true})
  description: string;

  @Column({name: 'price'})
  price: number;

  @OneToOne(() => StockEntity, stock => stock.product, {cascade: true})
  stock: StockEntity;
}