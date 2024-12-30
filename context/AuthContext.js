import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    clearAuth: () => {},
});


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    
    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
             if (decoded && decoded.userId && decoded.username) {
               setUser({ userId: decoded.userId, username: decoded.username });
               setToken(storedToken);
            } else {
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setUser(null);
           setToken(null);
        }
      }
    }, []);


    const login = (newToken) => {
         try {
             localStorage.setItem('token', newToken);
            const decoded = jwtDecode(newToken);
            if(decoded && decoded.userId && decoded.username){
                setUser({ userId: decoded.userId, username: decoded.username });
                setToken(newToken);
            } else{
              localStorage.removeItem('token');
                setUser(null);
                 setToken(null);
             }
         } catch (error) {
              console.error('Error during login token decoding:', error);
                localStorage.removeItem('token');
                 setUser(null);
                setToken(null);
         }
    };
    
    const logout = () => {
         localStorage.removeItem('token');
          setUser(null);
          setToken(null);
    };
    
    const clearAuth = () => {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }

    const contextValue = {
      user,
      token,
      login,
      logout,
      clearAuth
    };
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
