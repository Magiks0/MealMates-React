import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

  const AuthContext = createContext();

  export function AuthProvider({ children }) {
    const publicPaths = ['/', '/login', '/signup', '/login/google'];
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
      if (publicPaths.includes(location.pathname)) {
        setLoadingAuth(false);
        return;
      }

      const checkAuth = () => {
        const auth = AuthService.isAuthenticated();
        setIsAuthenticated(auth);
        setLoadingAuth(false);
      };
      checkAuth();
    }, []);

      const login = async (credentials) => {
        await AuthService.login(credentials);
        setIsAuthenticated(true);
      };

      const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
      };

      const loginWithToken = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
      };

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, loadingAuth, loginWithToken }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    return useContext(AuthContext);
  }
