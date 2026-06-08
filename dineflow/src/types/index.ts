export type UserRole = 'staff' | 'kitchen' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  shift: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'active' | 'inactive';
}

export interface IncomingOrder {
  id: string;
  table: number;
  items: string[];
  time: number;
}
