import { CartItem } from '../../cart/models';

export type Order = {
  id?: string,
  userId: string;
  cartId: string;
  items: CartItem[]
  payment: OrderPayment,
  delivery: OrderDelivery,
  comments: string,
  status: string;
  total: number;
}

export type OrderPayment = {
  type: PaymentType,
  address?: any,
  creditCard?: any,
}

export type OrderDelivery = {
  type: DeliveryType,
  address: any,
}

export enum OrderStatuses {
  IN_PROGRESS = 'in_progress',
  CANCELED = 'canceled',
  COMPLETED = 'completed'
}

export enum PaymentType {
  BY_CASH = 'by_cash',
  BY_CREDIT_CARD = 'by_credit_card'
}

export enum DeliveryType {
  PICKUP = 'pickup',
  BY_COURIER = 'by_courier'
}