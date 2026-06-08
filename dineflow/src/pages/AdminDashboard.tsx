import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { ADMIN_STATS, MOCK_MENU_ITEMS } from '../data/mockData';
import { Header } from '../components/layout/Header';
import { Sidebar, MobileSidebar } from '../components/layout/Sidebar';
import { StatCard, SectionHeader, StatusBadge } from '../components/common/index';
import { BarChart3, Users, MenuIcon, TrendingUp, AlertTriangle, Edit, Trash2, Plus, User, X, Check, FileText } from 'lucide-react';
import { MenuItem, StaffMember } from '../types';

const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: 'Habib', role: 'Waiter', shift: 'Morning Shift', status: 'active' },
  { id: 's2', name: 'Rina', role: 'Waiter', shift: 'Evening Shift', status: 'active' },
  { id: 's3', name: 'Selim', role: 'Kitchen', shift: 'Morning Shift', status: 'active' },
  { id: 's4', name: 'Mita', role: 'Cashier', shift: 'Afternoon Shift', status: 'inactive' },
];

interface MenuModal {
  mode: 'add' | 'edit';
  item?: MenuItem;
}
interface StaffModal {
  mode: 'add' | 'edit';
  member?: StaffMember;
}

export function AdminDashboard() {
  const { user, logout: authLogout } = useAuth();
  const [, navigate] = useLocation();
  const { orders } = useOrders();
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [menuModal, setMenuModal] = useState<MenuModal | null>(null);
  const [staffModal, setStaffModal] = useState<StaffModal | null>(null);
  const [menuForm, setMenuForm] = useState({ name: '', price: '', category: '' });
  const [staffForm, setStaffForm] = useState({ name: '', role: '', shift: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'menu' | 'staff'; id: string } | null>(null);

  const handleLogout = () => { authLogout(); navigate('/login'); };

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, value: 'dashboard' },
    { label: 'Menu', icon: MenuIcon, value: 'menu' },
    { label: 'Staff', icon: Users, value: 'staff' },
    { label: 'Orders', icon: FileText, value: 'orders' },
    { label: 'Profile', icon: User, value: 'profile' },
  ];

  const openAddMenu = () => {
    setMenuForm({ name: '', price: '', category: '' });
    setMenuModal({ mode: 'add' });
  };
  const openEditMenu = (item: MenuItem) => {
    setMenuForm({ name: item.name, price: String(item.price), category: item.category });
    setMenuModal({ mode: 'edit', item });
  };
  const saveMenu = () => {
    if (!menuForm.name || !menuForm.price) return;
    if (menuModal?.mode === 'add') {
      setMenuItems(prev => [...prev, { id: `m-${Date.now()}`, name: menuForm.name, price: Number(menuForm.price), category: menuForm.category }]);
    } else if (menuModal?.item) {
      setMenuItems(prev => prev.map(m => m.id === menuModal.item!.id ? { ...m, name: menuForm.name, price: Number(menuForm.price), category: menuForm.category } : m));
    }
    setMenuModal(null);
  };
  const deleteMenu = (id: string) => { setMenuItems(prev => prev.filter(m => m.id !== id)); setDeleteConfirm(null); };

  const openAddStaff = () => {
    setStaffForm({ name: '', role: '', shift: '' });
    setStaffModal({ mode: 'add' });
  };
  const openEditStaff = (member: StaffMember) => {
    setStaffForm({ name: member.name, role: member.role, shift: member.shift });
    setStaffModal({ mode: 'edit', member });
  };
  const saveStaff = () => {
    if (!staffForm.name) return;
    if (staffModal?.mode === 'add') {
      setStaff(prev => [...prev, { id: `s-${Date.now()}`, name: staffForm.name, role: staffForm.role, shift: staffForm.shift, status: 'active' }]);
    } else if (staffModal?.member) {
      setStaff(prev => prev.map(s => s.id === staffModal.member!.id ? { ...s, name: staffForm.name, role: staffForm.role, shift: staffForm.shift } : s));
    }
    setStaffModal(null);
  };
  const deleteStaff = (id: string) => { setStaff(prev => prev.filter(s => s.id !== id)); setDeleteConfirm(null); };
  const toggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const totalRevenue = orders.filter(o => o.status === 'served').reduce((sum, o) => sum + o.totalAmount, 0) + ADMIN_STATS.dailyRevenue;

  return (
    <div className="flex h-screen bg-stone-900 overflow-hidden">
      <Sidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} onLogout={handleLogout} userName={user?.name || 'Admin'} />
      <MobileSidebar items={sidebarItems} activeItem={activePage} onItemClick={setActivePage} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onLogout={handleLogout} userName={user?.name || 'Admin'} />

      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header title="Admin Panel" userName={user?.name || 'Admin'} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {activePage === 'dashboard' && (
              <>
                <div>
                  <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-stone-400 text-sm">Overview of The Grand Bistro</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={TrendingUp} label="Today's Revenue" value={`₹${totalRevenue.toLocaleString()}`} change={{ value: ADMIN_STATS.revenueChange, isPositive: true }} />
                  <StatCard icon={MenuIcon} label="Total Orders" value={orders.length + ADMIN_STATS.totalOrders} />
                  <StatCard icon={Users} label="Active Staff" value={staff.filter(s => s.status === 'active').length} />
                  <StatCard icon={AlertTriangle} label="Stock Level" value={`${ADMIN_STATS.stockLevel}%`} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                    <SectionHeader title="Menu Items" icon={MenuIcon} actionLabel="Manage Menu" onAction={() => setActivePage('menu')} />
                    <div className="space-y-3">
                      {menuItems.slice(0, 4).map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-stone-700 rounded-xl p-4 border border-stone-600">
                          <div>
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-stone-400 text-sm">{item.category} · ₹{item.price}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setActivePage('menu'); openEditMenu(item); }} className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"><Edit size={15} /></button>
                            <button onClick={() => setDeleteConfirm({ type: 'menu', id: item.id })} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setActivePage('menu'); openAddMenu(); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors text-sm">
                      <Plus size={16} /> Add Menu Item
                    </button>
                  </div>

                  <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                    <SectionHeader title="Staff" icon={Users} actionLabel="Manage Staff" onAction={() => setActivePage('staff')} />
                    <div className="space-y-3">
                      {staff.slice(0, 4).map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-stone-700 rounded-xl p-4 border border-stone-600">
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-stone-400 text-sm">{member.role} · {member.shift}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={member.status} />
                            <button onClick={() => { setActivePage('staff'); openEditStaff(member); }} className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"><Edit size={15} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setActivePage('staff'); openAddStaff(); }} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors text-sm">
                      <Plus size={16} /> Add Staff Member
                    </button>
                  </div>
                </div>
              </>
            )}

            {activePage === 'menu' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white text-lg font-bold">Menu Management</h2>
                  <button onClick={openAddMenu} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
                    <Plus size={16} /> Add Item
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{item.name}</div>
                        <div className="text-stone-400 text-sm mt-0.5">{item.category}</div>
                        <div className="text-orange-400 font-bold mt-1">₹{item.price}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditMenu(item)} className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm({ type: 'menu', id: item.id })} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePage === 'staff' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white text-lg font-bold">Staff Management</h2>
                  <button onClick={openAddStaff} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
                    <Plus size={16} /> Add Staff
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map(member => (
                    <div key={member.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-stone-400 text-sm">{member.role} · {member.shift}</div>
                          </div>
                        </div>
                        <StatusBadge status={member.status} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStaffStatus(member.id)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${member.status === 'active' ? 'bg-stone-600 hover:bg-stone-500 text-stone-300' : 'bg-green-700 hover:bg-green-600 text-white'}`}
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => openEditStaff(member)} className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm({ type: 'staff', id: member.id })} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePage === 'orders' && (
              <div className="bg-stone-800 rounded-xl border border-stone-700 p-6">
                <SectionHeader title="All Orders" />
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-stone-400 text-center py-8">No orders yet</p>
                  ) : orders.map(order => (
                    <div key={order.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">#{order.orderNumber}</div>
                        <div className="text-stone-400 text-sm">Table {order.tableNumber} · {order.items.length} items</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-400 font-bold">₹{order.totalAmount}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
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

      {menuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{menuModal.mode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
              <button onClick={() => setMenuModal(null)} className="text-stone-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Item Name</label>
                <input value={menuForm.name} onChange={e => setMenuForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Butter Chicken" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Price (₹)</label>
                <input type="number" value={menuForm.price} onChange={e => setMenuForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 350" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Category</label>
                <input value={menuForm.category} onChange={e => setMenuForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Main, Beverage, Dessert" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setMenuModal(null)} className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors font-medium text-sm">Cancel</button>
              <button onClick={saveMenu} disabled={!menuForm.name || !menuForm.price} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                <Check size={16} /> {menuModal.mode === 'add' ? 'Add Item' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {staffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{staffModal.mode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'}</h3>
              <button onClick={() => setStaffModal(null)} className="text-stone-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Name</label>
                <input value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Role</label>
                <input value={staffForm.role} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Waiter, Kitchen, Cashier" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
              <div>
                <label className="block text-stone-300 text-sm font-medium mb-1.5">Shift</label>
                <input value={staffForm.shift} onChange={e => setStaffForm(f => ({ ...f, shift: e.target.value }))} placeholder="e.g. Morning Shift" className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2.5 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStaffModal(null)} className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors font-medium text-sm">Cancel</button>
              <button onClick={saveStaff} disabled={!staffForm.name} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                <Check size={16} /> {staffModal.mode === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Delete {deleteConfirm.type === 'menu' ? 'Menu Item' : 'Staff Member'}?</h3>
            <p className="text-stone-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-xl transition-colors font-medium text-sm">Cancel</button>
              <button
                onClick={() => deleteConfirm.type === 'menu' ? deleteMenu(deleteConfirm.id) : deleteStaff(deleteConfirm.id)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
