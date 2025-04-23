// frontend/src/App.jsx
import { useRoutes } from 'react-router-dom';
import routes from './router.jsx';

function App() {
  const element = useRoutes(routes);
  return element;
}

export default App;
