import { LucideIcon, LogOut } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
        isActive
          ? 'bg-orange-500 text-white'
          : 'text-stone-300 hover:bg-stone-700 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

interface SidebarProps {
  items: Array<{ label: string; icon: LucideIcon; value: string }>;
  activeItem: string;
  onItemClick: (value: string) => void;
  onLogout: () => void;
  userName: string;
}

export function Sidebar({ items, activeItem, onItemClick, onLogout, userName }: SidebarProps) {
  return (
    <div className="hidden md:flex w-64 bg-stone-800 flex-col gap-6 p-6 h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
          D
        </div>
        <div>
          <div className="text-white font-bold tracking-wide">DINEFLOW</div>
          <div className="text-stone-400 text-xs">Restaurant Manager</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        {items.map(item => (
          <SidebarItem
            key={item.value}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.value}
            onClick={() => onItemClick(item.value)}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-stone-700">
        <div className="mb-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium text-sm">{userName}</p>
            <p className="text-stone-400 text-xs">Active</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

interface MobileSidebarProps {
  items: Array<{ label: string; icon: LucideIcon; value: string }>;
  activeItem: string;
  onItemClick: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName: string;
}

export function MobileSidebar({ items, activeItem, onItemClick, isOpen, onClose, onLogout, userName }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div className="absolute left-0 top-0 h-screen w-64 bg-stone-800 p-6 z-50 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">D</div>
          <div className="text-white font-bold">DINEFLOW</div>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          {items.map(item => (
            <SidebarItem
              key={item.value}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.value}
              onClick={() => { onItemClick(item.value); onClose(); }}
            />
          ))}
        </div>
        <div className="pt-4 border-t border-stone-700">
          <div className="mb-3 text-stone-300 text-sm font-medium">{userName}</div>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
