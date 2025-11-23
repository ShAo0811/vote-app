import { createContext } from 'react';

const UserStatsContext = createContext({
  userStats: null,
  setUserStats: () => {},
  refreshUserStats: () => {},
});

export default UserStatsContext;
