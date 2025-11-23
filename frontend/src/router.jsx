// frontend/src/router.jsx
import HomePage from './pages/HomePage.jsx';
import ArknightsPage from './pages/Arknights/ArknightsPage.jsx';
import ArknightsComparePage from './pages/Arknights/ArknightsComparePage.jsx';
import ArknightsVoteResult from './pages/Arknights/ArknightsVoteResult.jsx';
import LoginRegisterPage from './pages/LoginRegisterPage.jsx';

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginRegisterPage />
  },
  {
    path: '/arknights',
    element: <ArknightsPage />
  },
  {
    path: '/arknights/compare',
    element: <ArknightsComparePage />
  },
  {
    path: '/arknights/compare/result',
    element: <ArknightsVoteResult />
  }
];

export default routes;
