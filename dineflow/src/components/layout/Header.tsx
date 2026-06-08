import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  userName: string;
  onMenuClick?: () => void;
  notificationCount?: number;
}

export function Header({ title, userName, onMenuClick, notificationCount }: HeaderProps) {
  return (
    <div className="bg-stone-900 border-b border-stone-700 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden p-2 hover:bg-stone-800 rounded-lg transition-colors">
              <Menu size={20} className="text-stone-300" />
            </button>
          )}
          <div>
            <p className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Dashboard</p>
            <p className="text-white text-lg font-bold">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-stone-800 rounded-lg transition-colors">
            <Bell size={20} className="text-stone-400" />
            {notificationCount != null && notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden md:block">
            <p className="text-white font-medium text-sm">{userName}</p>
            <p className="text-stone-400 text-xs">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
