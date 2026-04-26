import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import Login from '../pages/Login';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 10000); // 10 seconds timer
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user && showLogin) {
    return (
      <>
        <div style={{ pointerEvents: 'none' }}>
          {children}
        </div>
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '100%', maxWidth: '500px', pointerEvents: 'auto' }}>
            <Login isModal={true} />
          </div>
        </div>
      </>
    );
  }
  
  return children;
}
