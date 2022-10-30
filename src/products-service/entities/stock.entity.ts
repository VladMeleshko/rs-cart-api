import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('Stocks')
export class StockEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column({name: 'count'})
  count: number;

  @OneToOne(() => ProductEntity, product => product.stock)
  @JoinColumn({name: 'product_id'})
  product: ProductEntity;
}