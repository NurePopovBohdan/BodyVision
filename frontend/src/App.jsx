import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => (
  <ProtectedRoute>
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </div>
  </ProtectedRoute>
);

export default App;
