
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [pathname, setPathname] = useState(
    window.location.pathname
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);

      setIsLoggedIn(
        localStorage.getItem('isLoggedIn') === 'true'
      );
    };

    window.addEventListener(
      'popstate',
      handleLocationChange
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handleLocationChange
      );
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const showDashboard =
    isLoggedIn && pathname !== '/login';

  return (
    <ThemeProvider>
      <div className="App">
        {showDashboard ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
