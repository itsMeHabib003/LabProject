import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { MOCK_MENU_ITEMS } from '../data/mockData';
import { Header } from '../components/layout/Header';
import { Sidebar, MobileSidebar } from '../components/layout/Sidebar';
import { StatCard, SectionHeader, StatusBadge, Tabs } from '../components/common/index';
import { UtensilsCrossed, FileText, BarChart3, User, Plus, X, ShoppingCart, Printer, Minus } from 'lucide-react';
import { Order } from '../types';

export function StaffDashboard() {
  const { user, logout: authLogout } = useAuth();
  const [, navigate] = useLocation();
  const { orders, currentOrder, createOrder, addItemToOrder, removeItemFromOrder, placeOrder, updateOrderStatus } = useOrders();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'served'>('pending');
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [billOrderId, setBillOrderId] = useState<string | null>(null);
  const [showBillPreview, setShowBillPreview] = useState(false);

  const handleLogout = () => { authLogout(); navigate('/login'); };

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, value: 'dashboard' },
    { label: 'Orders', icon: UtensilsCrossed, value: 'orders' },
    { label: 'Bills', icon: FileText, value: 'bills' },
    { label: 'Profile', icon: User, value: 'profile' },
  ];

  const tables = Array.from({ length: 12 }, (_, i) => {
    const number = i + 1;
    const tableOrder = orders.find(o => o.tableNumber === number && (o.status === 'pending' || o.status === 'preparing' || o.status === 'ready'));
    return {
      number,
      status: tableOrder ? 'occupied' as const : (number % 3 === 0 ? 'reserved' as const : 'available' as const),
    };
  });

  const ordersStatus = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
  };

  const handleCreateOrder = (tableNumber: number) => {
    createOrder(tableNumber);
    setSelectedTable(tableNumber);
    setItemQuantities({});
    setShowCreateOrder(true);
  };

  const handleAddItem = (menuItemId: string) => {
    const quantity = itemQuantities[menuItemId] || 1;
    const menuItem = MOCK_MENU_ITEMS.find(m => m.id === menuItemId);
    if (menuItem && quantity > 0) {
      addItemToOrder(menuItem, quantity);
      setItemQuantities(prev => ({ ...prev, [menuItemId]: 0 }));
    }
  };

  const handleQuantityChange = (menuItemId: string, delta: number) => {
    setItemQuantities(prev => ({ ...prev, [menuItemId]: Math.max(0, (prev[menuItemId] || 1) + delta) }));
  };

  const handlePlaceOrder = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      placeOrder();
      setShowCreateOrder(false);
      setSelectedTable(null);
    }
  };

  const handleGenerateBill = (orderId: string) => { setBillOrderId(orderId); setShowBillPreview(true); };
  const getBillOrder = (): Order | undefined => { if (!billOrderId) return undefined; return orders.find(o => o.id === billOrderId); };
  const handlePrintBill = () => window.print();

  const completedOrders = orders.filter(o => o.status === 'served');
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="flex h-screen bg-stone-900 overflow-hidden">
      <Sidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} onLogout={handleLogout} userName={user?.name || 'Staff'} />
      <MobileSidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onLogout={handleLogout} userName={user?.name || 'Staff'} />

      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header title={user?.name || 'Staff Dashboard'} userName={user?.name || 'Staff'} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} notificationCount={ordersStatus.ready} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {activePage === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={UtensilsCrossed} label="Available Tables" value={tables.filter(t => t.status === 'available').length} />
                  <StatCard icon={ShoppingCart} label="Active Orders" value={ordersStatus.pending + ordersStatus.preparing} />
                  <StatCard icon={UtensilsCrossed} label="Ready to Serve" value={ordersStatus.ready} />
                  <StatCard icon={FileText} label="Served Today" value={ordersStatus.served} />
                </div>

                <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                  <SectionHeader title="Tables" actionLabel="New Order" onAction={() => setActivePage('orders')} />
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {tables.map(table => (
                      <button
                        key={table.number}
                        onClick={() => table.status === 'available' && handleCreateOrder(table.number)}
                        disabled={table.status !== 'available'}
                        className={`aspect-square rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                          table.status === 'available'
                            ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer hover:scale-105'
                            : table.status === 'occupied'
                              ? 'bg-red-600 text-white cursor-not-allowed opacity-80'
                              : 'bg-yellow-600 text-white cursor-not-allowed opacity-80'
                        }`}
                      >
                        <span>T{table.number}</span>
                        <span className="text-xs font-normal opacity-80 capitalize">{table.status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                  <SectionHeader title="Recent Orders" actionLabel="View All" onAction={() => setActivePage('orders')} />
                  {recentOrders.length === 0 ? (
                    <p className="text-stone-400 text-center py-8">No orders yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recentOrders.map(order => (
                        <div key={order.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-white font-bold">#{order.orderNumber}</div>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="text-stone-400 text-sm mb-1">Table {order.tableNumber} · {order.items.length} items</div>
                          <div className="text-orange-400 font-bold mb-3">₹{order.totalAmount}</div>
                          {order.status === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'served')}
                              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors"
                            >
                              Mark Served
                            </button>
                          )}
                          {order.status === 'served' && (
                            <button
                              onClick={() => handleGenerateBill(order.id)}
                              className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <FileText size={14} /> Generate Bill
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activePage === 'orders' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white text-lg font-bold">Order Management</h2>
                  <button
                    onClick={() => {
                      const availableTable = tables.find(t => t.status === 'available');
                      if (availableTable) handleCreateOrder(availableTable.number);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    <Plus size={16} /> New Order
                  </button>
                </div>
                <Tabs
                  tabs={[
                    { label: `Pending (${ordersStatus.pending})`, value: 'pending' },
                    { label: `Preparing (${ordersStatus.preparing})`, value: 'preparing' },
                    { label: `Ready (${ordersStatus.ready})`, value: 'ready' },
                    { label: `Served (${ordersStatus.served})`, value: 'served' },
                  ]}
                  activeTab={activeTab}
                  onChange={v => setActiveTab(v as typeof activeTab)}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.filter(o => o.status === activeTab).map(order => (
                    <div key={order.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-white font-bold">#{order.orderNumber}</div>
                          <div className="text-stone-400 text-sm">Table {order.tableNumber}</div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="space-y-1 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="text-stone-300 text-sm">
                            {item.menuItem.name} × {item.quantity}
                            {item.menuItem.price > 0 && <span className="text-stone-400"> — ₹{item.menuItem.price * item.quantity}</span>}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-stone-600">
                        <span className="text-orange-400 font-bold">₹{order.totalAmount}</span>
                        <div className="flex gap-2">
                          {activeTab === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'served')}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors font-medium"
                            >
                              Mark Served
                            </button>
                          )}
                          {activeTab === 'served' && (
                            <button
                              onClick={() => handleGenerateBill(order.id)}
                              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors flex items-center gap-1 font-medium"
                            >
                              <FileText size={14} /> Bill
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === activeTab).length === 0 && (
                    <div className="col-span-2 text-center py-12 text-stone-400">No {activeTab} orders</div>
                  )}
                </div>
              </div>
            )}

            {activePage === 'bills' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <SectionHeader title="Bills" />
                {completedOrders.length === 0 ? (
                  <p className="text-stone-400 text-center py-12">No completed orders to bill yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedOrders.map(order => (
                      <div key={order.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="text-white font-bold">Order #{order.orderNumber}</div>
                            <div className="text-stone-400 text-sm">Table {order.tableNumber}</div>
                          </div>
                          <StatusBadge status="completed" label="Served" />
                        </div>
                        <div className="space-y-1 mb-4 text-stone-300 text-sm">
                          {order.items.slice(0, 3).map(item => (
                            <div key={item.id}>{item.menuItem.name} × {item.quantity}</div>
                          ))}
                          {order.items.length > 3 && <div className="text-stone-400 text-xs">+{order.items.length - 3} more</div>}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-stone-600">
                          <div className="text-orange-400 font-bold">₹{order.totalAmount}</div>
                          <button
                            onClick={() => handleGenerateBill(order.id)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                          >
                            <FileText size={15} /> Generate Bill
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activePage === 'profile' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6 max-w-md">
                <SectionHeader title="Profile" icon={User} />
                <div className="space-y-4">
                  {[
                    { label: 'Name', value: user?.name },
                    { label: 'Username', value: user?.username },
                    { label: 'Role', value: user?.role },
                    { label: 'Shift', value: user?.shift },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1 py-3 border-b border-stone-700 last:border-0">
                      <span className="text-stone-400 text-xs uppercase font-semibold tracking-wider">{label}</span>
                      <span className="text-white font-medium capitalize">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateOrder && currentOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-stone-800 border border-stone-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-stone-900 border-b border-stone-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">New Order — Table {selectedTable}</h3>
                <p className="text-stone-400 text-sm">{currentOrder.items.length} items selected</p>
              </div>
              <button onClick={() => setShowCreateOrder(false)} className="p-2 hover:bg-stone-700 rounded-lg text-stone-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Menu</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_MENU_ITEMS.map(item => (
                    <div key={item.id} className="bg-stone-700 border border-stone-600 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-white font-medium text-sm">{item.name}</div>
                          <div className="text-stone-400 text-xs">{item.category}</div>
                          <div className="text-orange-400 font-bold mt-1">₹{item.price}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(item.id, -1)} className="p-1.5 bg-stone-600 hover:bg-stone-500 rounded-lg text-white transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-bold w-6 text-center text-sm">{itemQuantities[item.id] || 1}</span>
                        <button onClick={() => handleQuantityChange(item.id, 1)} className="p-1.5 bg-stone-600 hover:bg-stone-500 rounded-lg text-white transition-colors">
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => handleAddItem(item.id)}
                          className="flex-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-700 border border-stone-600 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-3">Order Summary</h4>
                {currentOrder.items.length === 0 ? (
                  <p className="text-stone-400 text-sm">No items added yet</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {currentOrder.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-stone-300 text-sm">
                          <span>{item.menuItem.name} × {item.quantity}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white">₹{item.menuItem.price * item.quantity}</span>
                            <button onClick={() => removeItemFromOrder(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900 rounded p-0.5 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-stone-600 pt-3 flex items-center justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-orange-400 font-bold text-lg">₹{currentOrder.totalAmount}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowCreateOrder(false)} className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors font-medium">Cancel</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!currentOrder.items.length}
                  className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Place Order (₹{currentOrder.totalAmount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBillPreview && (() => { const order = getBillOrder(); if (!order) return null; const tax = Math.round(order.totalAmount * 0.05); return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">DineFlow</h2>
                  <p className="text-orange-100 text-sm">The Grand Bistro</p>
                </div>
                <button onClick={() => setShowBillPreview(false)} className="p-2 hover:bg-orange-600 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-gray-500 text-xs uppercase font-semibold">Order</p>
                <p className="text-2xl font-bold text-gray-900">#{order.orderNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm border-b border-gray-200 pb-4">
                <div><p className="text-gray-500 text-xs">Table</p><p className="font-bold text-gray-900">{order.tableNumber}</p></div>
                <div><p className="text-gray-500 text-xs">Date</p><p className="font-bold text-gray-900">{new Date().toLocaleDateString()}</p></div>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <p className="text-gray-700 font-bold text-xs uppercase mb-3">Items</p>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-900 font-medium">{item.menuItem.name}</p>
                        {item.menuItem.price > 0 && <p className="text-gray-500 text-xs">₹{item.menuItem.price} × {item.quantity}</p>}
                      </div>
                      {item.menuItem.price > 0 && <p className="text-gray-900 font-bold">₹{item.menuItem.price * item.quantity}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2 border-b border-gray-200 pb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-900">₹{order.totalAmount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax (5%)</span><span className="text-gray-900">₹{tax}</span></div>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-orange-600">₹{order.totalAmount + tax}</p>
              </div>
              <p className="text-center text-gray-400 text-sm">Thank you for dining with us!</p>
            </div>
            <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <button onClick={() => setShowBillPreview(false)} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors">Close</button>
              <button onClick={handlePrintBill} className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Printer size={16} /> Print Bill
              </button>
            </div>
          </div>
        </div>
      ); })()}
    </div>
  );
}
