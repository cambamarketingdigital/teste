import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Commissions from './pages/Commissions';
import Leads from './pages/Leads';
import Meetings from './pages/Meetings';
import Tasks from './pages/Tasks';
import Consultants from './pages/Consultants';
import Clients from './pages/Clients';
import Reports from './pages/Reports';
import MyCustomers from './pages/MyCustomers';
import Scripts from './pages/Scripts';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Financial from './pages/Financial';
import Blog from './pages/Blog';
import Announcements from './pages/Announcements';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = user 
      ? `Camba Marketing Digital - ${user.name}` 
      : 'Camba Marketing Digital - Login';
  }, [user]);
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login />
        } />
        
        <Route path="/" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="commissions" element={<Commissions />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="consultants" element={<Consultants />} />
          <Route path="clients" element={<Clients />} />
          <Route path="reports" element={<Reports />} />
          <Route path="my-customers" element={<MyCustomers />} />
          <Route path="scripts" element={<Scripts />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="financial" element={<Financial />} />
          <Route path="blog" element={<Blog />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;