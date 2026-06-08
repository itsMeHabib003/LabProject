import { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderItem, MenuItem, IncomingOrder, OrderStatus } from '../types';
import { MOCK_ORDERS, KITCHEN_INCOMING } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  incomingOrders: IncomingOrder[];
  createOrder: (tableNumber: number) => void;
  addItemToOrder: (menuItem: MenuItem, quantity: number) => void;
  removeItemFromOrder: (itemId: string) => void;
  placeOrder: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  acceptIncomingOrder: (incomingId: string) => void;
  rejectIncomingOrder: (incomingId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(KITCHEN_INCOMING);

  const createOrder = (tableNumber: number) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      tableNumber,
      items: [],
      status: 'pending',
      totalAmount: 0,
      createdAt: new Date(),
    };
    setCurrentOrder(newOrder);
  };

  const addItemToOrder = (menuItem: MenuItem, quantity: number) => {
    if (!currentOrder) return;
    const existingItem = currentOrder.items.find(item => item.menuItem.id === menuItem.id);
    const updatedItems: OrderItem[] = existingItem
      ? currentOrder.items.map(item =>
          item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...currentOrder.items, { id: `${menuItem.id}-${Date.now()}`, menuItem, quantity }];
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    setCurrentOrder({ ...currentOrder, items: updatedItems, totalAmount });
  };

  const removeItemFromOrder = (itemId: string) => {
    if (!currentOrder) return;
    const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    setCurrentOrder({ ...currentOrder, items: updatedItems, totalAmount });
  };

  const placeOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) return;
    const placedOrder: Order = { ...currentOrder, status: 'pending', createdAt: new Date() };
    setOrders(prev => [...prev, placedOrder]);
    setCurrentOrder(null);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const acceptIncomingOrder = (incomingId: string) => {
    const incoming = incomingOrders.find(o => o.id === incomingId);
    if (!incoming) return;
    const newOrder: Order = {
      id: incomingId,
      orderNumber: incomingId.replace('ORD-', ''),
      tableNumber: incoming.table,
      items: incoming.items.map((itemStr, idx) => {
        const parts = itemStr.split(' x ');
        const qty = parseInt(parts[1] || '1');
        return {
          id: `${incomingId}-${idx}`,
          menuItem: { id: `ki-${idx}`, name: parts[0], price: 0, category: 'Kitchen' },
          quantity: qty,
        };
      }),
      status: 'preparing',
      totalAmount: 0,
      createdAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    setIncomingOrders(prev => prev.filter(o => o.id !== incomingId));
  };

  const rejectIncomingOrder = (incomingId: string) => {
    setIncomingOrders(prev => prev.filter(o => o.id !== incomingId));
  };

  const getOrderById = (orderId: string) => orders.find(order => order.id === orderId);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        incomingOrders,
        createOrder,
        addItemToOrder,
        removeItemFromOrder,
        placeOrder,
        updateOrderStatus,
        acceptIncomingOrder,
        rejectIncomingOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
