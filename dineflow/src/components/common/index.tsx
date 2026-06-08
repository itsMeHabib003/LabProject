import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
}

export function StatCard({ icon: Icon, label, value, change }: StatCardProps) {
  return (
    <div className="bg-stone-800 border border-stone-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-stone-400 text-sm font-medium">{label}</span>
        <div className="bg-orange-500 bg-opacity-15 p-2 rounded-lg">
          <Icon size={18} className="text-orange-500" />
        </div>
      </div>
      <div className="text-white text-2xl font-bold">{value}</div>
      {change && (
        <div className={`text-xs font-semibold flex items-center gap-1 ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}% from yesterday
        </div>
      )}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, icon: Icon, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={20} className="text-orange-500" />}
        <h2 className="text-white text-lg font-bold">{title}</h2>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

type BadgeStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'active' | 'inactive';

interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles: Record<BadgeStatus, string> = {
    pending: 'bg-stone-600 text-stone-100',
    preparing: 'bg-orange-600 text-orange-100',
    ready: 'bg-green-600 text-green-100',
    served: 'bg-blue-600 text-blue-100',
    completed: 'bg-teal-600 text-teal-100',
    active: 'bg-green-600 text-green-100',
    inactive: 'bg-stone-600 text-stone-300',
  };

  const labels: Record<BadgeStatus, string> = {
    pending: 'Pending',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    completed: 'Completed',
    active: 'Active',
    inactive: 'Inactive',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {label ?? labels[status]}
    </span>
  );
}

interface TabsProps {
  tabs: Array<{ label: string; value: string }>;
  activeTab: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-stone-600 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === tab.value
              ? 'text-orange-400 border-orange-500'
              : 'text-stone-400 border-transparent hover:text-stone-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
