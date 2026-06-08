import { Switch, Route, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { LoginPage } from './pages/LoginPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, role }: { component: React.ComponentType; role: string }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  if (user?.role !== role) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/staff">
        <ProtectedRoute component={StaffDashboard} role="staff" />
      </Route>
      <Route path="/kitchen">
        <ProtectedRoute component={KitchenDashboard} role="kitchen" />
      </Route>
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>
      <Route path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrderProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </OrderProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
