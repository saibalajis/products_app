import React, { useState } from 'react';

const credentials = {
  admin: { username: 'admin', password: 'admin123' },
  customer: { username: 'customer', password: 'customer123' },
};

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('customer');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredUsername = formData.username.trim();
    const enteredPassword = formData.password;
    const validCredentials = credentials[selectedRole];

    if (!enteredUsername || !enteredPassword) {
      setError('Please enter your username and password.');
      return;
    }

    if (
      enteredUsername === validCredentials.username &&
      enteredPassword === validCredentials.password
    ) {
      setError('');
      onLogin({
        role: selectedRole,
        username: enteredUsername,
      });
      return;
    }

    setError('Incorrect credentials for this account type.');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to your store</h1>

        <div className="role-toggle" aria-label="Choose account type">
          <button
            type="button"
            className={selectedRole === 'customer' ? 'role-btn active' : 'role-btn'}
            onClick={() => setSelectedRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={selectedRole === 'admin' ? 'role-btn active' : 'role-btn'}
            onClick={() => setSelectedRole('admin')}
          >
            Admin
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>{selectedRole === 'admin' ? 'Admin username' : 'Customer username'}</span>
            <input
              type="text"
              name="username"
              placeholder={selectedRole === 'admin' ? 'admin' : 'customer'}
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label className="field-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder={selectedRole === 'admin' ? 'admin123' : 'customer123'}
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-btn">
            Sign in as {selectedRole}
          </button>
        </form>

        <p className="demo-note">
          Demo credentials: <strong>admin / admin123</strong> or <strong>customer / customer123</strong>
        </p>
      </div>
    </div>
  );
}
