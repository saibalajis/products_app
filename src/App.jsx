import { useState } from 'react';
import Login from './components/Login';
import ProductCatalog from './components/ProductCatalog';

export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <ProductCatalog user={user} onLogout={() => setUser(null)} />;
}
