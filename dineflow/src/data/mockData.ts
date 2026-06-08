import { MenuItem, Order, StaffMember, IncomingOrder } from '../types';

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Margherita Pizza', price: 450, category: 'Pizza' },
  { id: '2', name: 'Grilled Salmon', price: 650, category: 'Main' },
  { id: '3', name: 'Caesar Salad', price: 280, category: 'Salad' },
  { id: '4', name: 'Pasta Carbonara', price: 380, category: 'Pasta' },
  { id: '5', name: 'Chocolate Cake', price: 150, category: 'Dessert' },
  { id: '6', name: 'Tiramisu', price: 180, category: 'Dessert' },
  { id: '7', name: 'Espresso', price: 80, category: 'Beverage' },
  { id: '8', name: 'Fresh Orange Juice', price: 120, category: 'Beverage' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    orderNumber: '1042',
    tableNumber: 5,
    items: [
      { id: '1', menuItem: MOCK_MENU_ITEMS[0], quantity: 2 },
      { id: '2', menuItem: MOCK_MENU_ITEMS[6], quantity: 1 },
    ],
    status: 'preparing',
    totalAmount: 980,
    createdAt: new Date(Date.now() - 900000),
  },
  {
    id: 'ORD-1041',
    orderNumber: '1041',
    tableNumber: 2,
    items: [
      { id: '3', menuItem: MOCK_MENU_ITEMS[1], quantity: 2 },
      { id: '4', menuItem: MOCK_MENU_ITEMS[2], quantity: 3 },
    ],
    status: 'ready',
    totalAmount: 2120,
    createdAt: new Date(Date.now() - 600000),
  },
  {
    id: 'ORD-1040',
    orderNumber: '1040',
    tableNumber: 8,
    items: [
      { id: '5', menuItem: MOCK_MENU_ITEMS[3], quantity: 2 },
    ],
    status: 'served',
    totalAmount: 760,
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: 'ORD-1039',
    orderNumber: '1039',
    tableNumber: 3,
    items: [
      { id: '6', menuItem: MOCK_MENU_ITEMS[4], quantity: 1 },
      { id: '7', menuItem: MOCK_MENU_ITEMS[5], quantity: 2 },
    ],
    status: 'pending',
    totalAmount: 510,
    createdAt: new Date(Date.now() - 120000),
  },
];

export const KITCHEN_INCOMING: IncomingOrder[] = [
  { id: 'ORD-045', table: 7, items: ['Margherita Pizza x 2', 'Pasta Carbonara x 1'], time: 15 },
  { id: 'ORD-046', table: 12, items: ['Grilled Salmon x 1', 'Caesar Salad x 2'], time: 20 },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Habib', role: 'Waiter', shift: 'Morning Shift', status: 'active' },
  { id: 's2', name: 'Rina', role: 'Waiter', shift: 'Evening Shift', status: 'active' },
  { id: 's3', name: 'Selim', role: 'Kitchen', shift: 'Morning Shift', status: 'active' },
  { id: 's4', name: 'Mita', role: 'Cashier', shift: 'Afternoon Shift', status: 'inactive' },
];

export const ADMIN_STATS = {
  dailyRevenue: 48320,
  revenueChange: 12.4,
  totalOrders: 134,
  activeStaff: 18,
  stockLevel: 72,
};
