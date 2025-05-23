// src/types/order.ts

/**
 * The possible order status values
 */
export type OrderStatus = "pending" | "processing" | "completed" | "canceled";

/**
 * The possible order shipping methods
 */
export type ShippingMethod = "delivery" | "pickup";

/**
 * The possible order payment status values
 */
export type PaymentStatus = "paid" | "unpaid" | "partially_paid";

/**
 * The possible payment methods
 */
export type PaymentMethod = "cash" | "mobileMoney" | "bankTransfer" | "card";

/**
 * Order customer interface
 */
export interface OrderCustomer {
  name: string;
  email?: string;
  phone?: string;
  id?: string; // Optional reference to customers collection
}

/**
 * Main Order interface
 */
export interface Order {
  id: string;
  business_id: string;
  customer: OrderCustomer;
  status: OrderStatus;
  shipping_method: ShippingMethod;
  shipping_address?: string;
  city?: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod | string;
  payment_status: PaymentStatus;
  payment_reference?: string;
  notes?: string;
  item_count: number;
  tracking_number?: string;
  created_at: Date; // Converted from Firestore timestamp
  updated_at: Date; // Converted from Firestore timestamp
  completed_at?: Date; // Optional, converted from Firestore timestamp
}

/**
 * Order item interface
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_option_id?: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
  created_at: Date; // Converted from Firestore timestamp
}

/**
 * Interface for creating a new order
 */
export interface CreateOrderInput {
  customer: {
    name: string;
    email?: string;
    phone?: string;
    id?: string;
  };
  shipping_method: ShippingMethod;
  shipping_address?: string;
  city?: string;
  payment_method: string;
  payment_status?: PaymentStatus;
  payment_reference?: string;
  notes?: string;
  status?: OrderStatus;
}

/**
 * Interface for adding an order item
 */
export interface CreateOrderItemInput {
  product_id: string;
  product_option_id?: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

/**
 * Order status custom definition interface
 */
export interface OrderStatusDefinition {
  id: string;
  business_id: string;
  name: string;
  color: string;
  description: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Order notification interface
 */
export interface OrderNotification {
  id: string;
  order_id: string;
  customer_id?: string;
  business_id: string;
  type:
    | "order_created"
    | "status_changed"
    | "payment_received"
    | "order_canceled";
  message: string;
  is_read: boolean;
  created_at: Date;
}

/**
 * Order history log interface
 */
export interface OrderHistory {
  id: string;
  order_id: string;
  status: OrderStatus | string;
  notes?: string;
  created_by: string;
  created_at: Date;
}

/**
 * Order filter options
 */
export interface OrderFilters {
  status?: OrderStatus | "all";
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  paymentStatus?: PaymentStatus | "all";
  shippingMethod?: ShippingMethod | "all";
}

/**
 * Order statistics
 */
export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
  recent?: {
    count: number;
    percentage: number;
  };
  revenue?: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}
