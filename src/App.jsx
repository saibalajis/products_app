import { useState } from 'react';
import Login from './components/Login';
import ProductCatalog from './components/ProductCatalog';
import Register from './components/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [showRegister, setShowRegister] = useState(false);

  const handleRegister = (newUser) => {
    setRegisteredUsers((previous) => [...previous, newUser]);
    setUser({ role: 'customer', username: newUser.username });
  };

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        users={registeredUsers}
        onLogin={setUser}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <ProductCatalog user={user} onLogout={() => setUser(null)} />;
}
