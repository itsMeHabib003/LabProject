import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Header } from '../components/layout/Header';
import { Sidebar, MobileSidebar } from '../components/layout/Sidebar';
import { StatCard, SectionHeader, StatusBadge, Tabs } from '../components/common/index';
import { ChefHat, Bell, BarChart3, User, CheckCircle, X, AlertCircle, Clock, Flame } from 'lucide-react';

type KitchenTab = 'pending' | 'cooking' | 'ready';

export function KitchenDashboard() {
  const { user, logout: authLogout } = useAuth();
  const [, navigate] = useLocation();
  const { orders, incomingOrders, updateOrderStatus, acceptIncomingOrder, rejectIncomingOrder } = useOrders();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<KitchenTab>('pending');

  const handleLogout = () => { authLogout(); navigate('/login'); };

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, value: 'dashboard' },
    { label: 'Queue', icon: ChefHat, value: 'queue' },
    { label: 'Analytics', icon: Flame, value: 'analytics' },
    { label: 'Profile', icon: User, value: 'profile' },
  ];

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const cookingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const totalActive = pendingOrders.length + cookingOrders.length;

  const ordersByStatus: Record<KitchenTab, typeof orders> = {
    pending: pendingOrders,
    cooking: cookingOrders,
    ready: readyOrders,
  };

  return (
    <div className="flex h-screen bg-stone-900 overflow-hidden">
      <Sidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} onLogout={handleLogout} userName={user?.name || 'Kitchen'} />
      <MobileSidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onLogout={handleLogout} userName={user?.name || 'Kitchen'} />

      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header title={user?.name || 'Kitchen'} userName={user?.name || 'Kitchen'} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} notificationCount={incomingOrders.length} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {activePage === 'dashboard' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-white text-2xl font-bold">Kitchen Queue</h1>
                    <p className="text-stone-400 text-sm">Manage cooking queue in real time</p>
                  </div>
                  {totalActive > 0 && (
                    <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 text-yellow-300 px-4 py-2 rounded-full font-semibold flex items-center gap-2 self-start sm:self-auto">
                      <AlertCircle size={16} />
                      {totalActive} Active Orders
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Bell} label="Incoming" value={incomingOrders.length} />
                  <StatCard icon={AlertCircle} label="Pending" value={pendingOrders.length} />
                  <StatCard icon={ChefHat} label="Cooking" value={cookingOrders.length} />
                  <StatCard icon={CheckCircle} label="Ready" value={readyOrders.length} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">

                    {incomingOrders.length > 0 && (
                      <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <Bell size={18} className="text-orange-500" />
                            Incoming Orders
                          </h2>
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{incomingOrders.length} new</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {incomingOrders.map(order => (
                            <div key={order.id} className="bg-stone-700 rounded-xl p-4 border border-orange-600 border-opacity-40">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="text-white font-bold">#{order.id}</div>
                                  <div className="text-stone-400 text-sm">Table {order.table}</div>
                                </div>
                                <div className="flex items-center gap-1.5 text-orange-400 bg-orange-500 bg-opacity-15 px-2.5 py-1 rounded-full">
                                  <Clock size={13} />
                                  <span className="text-xs font-bold">{order.time} min</span>
                                </div>
                              </div>
                              <div className="space-y-1.5 mb-4">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="text-stone-300 text-sm flex items-center gap-2">
                                    <ChefHat size={12} className="text-orange-500 flex-shrink-0" />
                                    {item}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => acceptIncomingOrder(order.id)}
                                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle size={15} /> Accept
                                </button>
                                <button
                                  onClick={() => rejectIncomingOrder(order.id)}
                                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <X size={15} /> Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                      <SectionHeader title="Active Cooking Queue" />
                      <Tabs
                        tabs={[
                          { label: `Pending (${pendingOrders.length})`, value: 'pending' },
                          { label: `Cooking (${cookingOrders.length})`, value: 'cooking' },
                          { label: `Ready (${readyOrders.length})`, value: 'ready' },
                        ]}
                        activeTab={activeTab}
                        onChange={v => setActiveTab(v as KitchenTab)}
                      />
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ordersByStatus[activeTab].map(order => (
                          <div
                            key={order.id}
                            className={`rounded-xl p-4 border-2 transition-all ${
                              activeTab === 'pending'
                                ? 'border-stone-600 bg-stone-700'
                                : activeTab === 'cooking'
                                  ? 'border-orange-500 bg-orange-500 bg-opacity-5'
                                  : 'border-green-500 bg-green-500 bg-opacity-5'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-white font-bold">#{order.orderNumber}</div>
                              <StatusBadge status={activeTab === 'cooking' ? 'preparing' : order.status} />
                            </div>
                            <div className="text-stone-400 text-sm mb-3">
                              Table {order.tableNumber} · {order.items.length} items
                            </div>
                            <div className="space-y-1 mb-4">
                              {order.items.map(item => (
                                <div key={item.id} className="text-stone-300 text-sm flex items-center gap-1.5">
                                  <span className="text-orange-500">·</span>
                                  {item.menuItem.name} × {item.quantity}
                                </div>
                              ))}
                            </div>
                            {activeTab === 'pending' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Flame size={15} /> Start Cooking
                              </button>
                            )}
                            {activeTab === 'cooking' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle size={15} /> Mark Ready
                              </button>
                            )}
                            {activeTab === 'ready' && (
                              <div className="text-center text-green-400 text-sm font-bold py-1.5 bg-green-500 bg-opacity-10 rounded-lg">
                                ✓ Ready for Pickup
                              </div>
                            )}
                          </div>
                        ))}
                        {ordersByStatus[activeTab].length === 0 && (
                          <div className="col-span-3 text-center py-10 text-stone-400">
                            No {activeTab === 'cooking' ? 'orders being cooked' : activeTab + ' orders'} right now
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-orange-500" />
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        {readyOrders.length > 0 && readyOrders.map(o => (
                          <div key={o.id} className="bg-green-500 bg-opacity-10 border border-green-600 border-opacity-50 rounded-lg p-3">
                            <div className="text-green-400 text-sm font-medium">Table {o.tableNumber} order ready for pickup</div>
                            <div className="text-green-500 text-xs mt-1">Order #{o.orderNumber}</div>
                          </div>
                        ))}
                        {cookingOrders.length > 0 && cookingOrders.map(o => (
                          <div key={o.id} className="bg-orange-500 bg-opacity-10 border border-orange-600 border-opacity-50 rounded-lg p-3">
                            <div className="text-orange-400 text-sm font-medium">Cooking order for Table {o.tableNumber}</div>
                            <div className="text-orange-500 text-xs mt-1">#{o.orderNumber}</div>
                          </div>
                        ))}
                        {incomingOrders.map(o => (
                          <div key={o.id} className="bg-blue-500 bg-opacity-10 border border-blue-600 border-opacity-50 rounded-lg p-3">
                            <div className="text-blue-400 text-sm font-medium">New order from Table {o.table}</div>
                            <div className="text-blue-500 text-xs mt-1">Awaiting acceptance</div>
                          </div>
                        ))}
                        {readyOrders.length === 0 && cookingOrders.length === 0 && incomingOrders.length === 0 && (
                          <p className="text-stone-400 text-sm text-center py-4">No notifications</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activePage === 'queue' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <SectionHeader title="Complete Cooking Queue" />
                <Tabs
                  tabs={[
                    { label: `Pending (${pendingOrders.length})`, value: 'pending' },
                    { label: `Cooking (${cookingOrders.length})`, value: 'cooking' },
                    { label: `Ready (${readyOrders.length})`, value: 'ready' },
                  ]}
                  activeTab={activeTab}
                  onChange={v => setActiveTab(v as KitchenTab)}
                />
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ordersByStatus[activeTab].map(order => (
                    <div key={order.id} className={`rounded-xl p-4 border-2 ${activeTab === 'pending' ? 'border-stone-600 bg-stone-700' : activeTab === 'cooking' ? 'border-orange-500 bg-orange-500 bg-opacity-5' : 'border-green-500 bg-green-500 bg-opacity-5'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold">#{order.orderNumber}</span>
                        <StatusBadge status={activeTab === 'cooking' ? 'preparing' : order.status} />
                      </div>
                      <div className="text-stone-400 text-sm mb-3">Table {order.tableNumber}</div>
                      <div className="space-y-1 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="text-stone-300 text-sm">· {item.menuItem.name} × {item.quantity}</div>
                        ))}
                      </div>
                      {activeTab === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg font-medium transition-colors">Start Cooking</button>}
                      {activeTab === 'cooking' && <button onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors">Mark Ready</button>}
                      {activeTab === 'ready' && <div className="text-center text-green-400 text-sm font-bold py-1.5">✓ Ready for Pickup</div>}
                    </div>
                  ))}
                  {ordersByStatus[activeTab].length === 0 && <div className="col-span-3 text-center py-10 text-stone-400">No orders in this stage</div>}
                </div>
              </div>
            )}

            {activePage === 'analytics' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <SectionHeader title="Kitchen Analytics" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard icon={CheckCircle} label="Orders Completed" value={orders.filter(o => o.status === 'served' || o.status === 'ready').length} />
                  <StatCard icon={ChefHat} label="Avg Cook Time" value="18 min" />
                  <StatCard icon={AlertCircle} label="Pending" value={pendingOrders.length} />
                  <StatCard icon={Flame} label="Currently Cooking" value={cookingOrders.length} />
                </div>
                <div className="bg-stone-700 rounded-xl p-5 border border-stone-600">
                  <h3 className="text-white font-bold mb-4">Order Flow Today</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { label: 'Received', count: orders.length + incomingOrders.length, color: 'bg-stone-500' },
                      { label: 'Accepted', count: orders.length, color: 'bg-orange-500' },
                      { label: 'Ready', count: readyOrders.length + orders.filter(o => o.status === 'served').length, color: 'bg-green-500' },
                    ].map((stat, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div className={`h-2 rounded-full mb-2 ${stat.color}`} />
                        <div className="text-white font-bold text-lg">{stat.count}</div>
                        <div className="text-stone-400 text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePage === 'profile' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6 max-w-md">
                <SectionHeader title="Profile" icon={User} />
                <div className="space-y-4">
                  {[
                    { label: 'Name', value: user?.name },
                    { label: 'Role', value: user?.role },
                    { label: 'Shift', value: user?.shift },
                    { label: 'Status', value: 'Active' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1 py-3 border-b border-stone-700 last:border-0">
                      <span className="text-stone-400 text-xs uppercase font-semibold tracking-wider">{label}</span>
                      <span className={`font-medium capitalize ${label === 'Status' ? 'text-green-400' : 'text-white'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
