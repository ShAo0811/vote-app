import React, { useRef, useState, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router.jsx';
import Header from './components/Header';
import UserStatsContext from './context/UserStatsContext';

function App() {
  const headerRef = useRef();
  const [refreshCount, setRefreshCount] = useState(0);
  const [userStats, setUserStats] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const fetchUserStats = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user_stats`, {
      credentials: 'include'
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUserStats(data);
          if (data.username) setUsername(data.username);
        }
      });
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const refreshUserStats = () => {
    fetchUserStats();
    setRefreshCount(prev => prev + 1);
  };

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      localStorage.removeItem('username');
      localStorage.removeItem('user_id');
      window.location.href = '/';
    });
  };

  const element = useRoutes(routes);

  return (
    <UserStatsContext.Provider value={{ userStats, refreshUserStats }}>
      <Header ref={headerRef} username={username} handleLogout={handleLogout} key={refreshCount} />
      {element}
    </UserStatsContext.Provider>
  );
}

export default App;
