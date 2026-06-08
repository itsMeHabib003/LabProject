import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS: Record<string, { password: string; role: UserRole; name: string; shift: string }> = {
  staff: { password: 'staff345', role: 'staff', name: 'Habib', shift: 'Morning Shift' },
  kitchen: { password: 'kitchen345', role: 'kitchen', name: 'Selim', shift: 'Kitchen Staff' },
  admin: { password: 'admin345', role: 'admin', name: 'Anonto', shift: 'Admin Panel' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    const credentials = VALID_CREDENTIALS[username];
    if (!credentials) return { success: false, error: 'Invalid username' };
    if (credentials.password !== password) return { success: false, error: 'Invalid password' };
    setUser({
      id: `${credentials.role}-${username}`,
      name: credentials.name,
      username,
      role: credentials.role,
      shift: credentials.shift,
    });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
