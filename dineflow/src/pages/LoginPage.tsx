import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Flame, ChefHat, Lock, Users } from 'lucide-react';

export function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Please enter both username and password'); return; }
    const result = login(username, password);
    if (result.success) {
      const routes: Record<string, string> = { staff: '/staff', kitchen: '/kitchen', admin: '/admin' };
      navigate(routes[username] || '/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const roles = [
    { username: 'staff', password: 'staff345', label: 'Staff (Waiter)', icon: <Users size={18} /> },
    { username: 'kitchen', password: 'kitchen345', label: 'Kitchen', icon: <ChefHat size={18} /> },
    { username: 'admin', password: 'admin345', label: 'Admin', icon: <Lock size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950 flex items-center justify-between px-4 sm:px-8 lg:px-16 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />

      <div className="hidden lg:flex flex-col justify-center max-w-lg relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Flame className="text-white" size={26} />
          </div>
          <div>
            <div className="text-white font-bold text-2xl tracking-wide">DINEFLOW</div>
            <div className="text-orange-400 text-sm">Smart Restaurant Management</div>
          </div>
        </div>
        <h1 className="text-white text-5xl font-bold mb-5 leading-tight">
          Welcome to<br /><span className="text-orange-400">DineFlow</span>
        </h1>
        <p className="text-stone-300 text-lg leading-relaxed">
          Manage orders, kitchen workflows, and billing in one elegant place.
        </p>
        <div className="flex gap-3 mt-8">
          {[Users, ChefHat, Lock].map((Icon, i) => (
            <div key={i} className="w-12 h-12 bg-orange-500 bg-opacity-15 border border-orange-500 border-opacity-30 rounded-xl flex items-center justify-center">
              <Icon size={22} className="text-orange-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 mx-auto lg:mx-0">
        <div className="bg-stone-800 bg-opacity-90 backdrop-blur-md border border-stone-700 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="text-white" size={18} />
            </div>
            <div className="text-white font-bold text-lg">DINEFLOW</div>
          </div>

          <h2 className="text-white text-2xl font-bold mb-1">Sign In</h2>
          <p className="text-stone-400 text-sm mb-7">Enter your credentials to access your dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-stone-700 border border-stone-600 rounded-lg pl-9 pr-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-stone-700 border border-stone-600 rounded-lg pl-9 pr-10 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-15 border border-red-600 border-opacity-50 rounded-lg p-3 flex items-center gap-2">
                <Lock size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
            >
              <Lock size={16} />
              Sign In
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-stone-800 text-stone-500">or sign in as</span>
              </div>
            </div>

            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.username}
                  type="button"
                  onClick={() => { setUsername(role.username); setPassword(role.password); setError(''); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-white text-sm font-medium transition-colors"
                >
                  {role.icon}
                  {role.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
