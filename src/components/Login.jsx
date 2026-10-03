import { useState } from 'react';

const credentials = {
  admin: { username: 'admin', password: 'admin123' },
  customer: { username: 'customer', password: 'customer123' },
};

export default function Login({ onLogin, users = [], onSwitchToRegister }) {
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
    const validCredentials =
      selectedRole === 'customer'
        ? users.find((user) => user.username === enteredUsername) || credentials.customer
        : credentials.admin;

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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 max-[600px]:p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Welcome back</p>
        <h1 className="mb-5 text-3xl font-bold text-slate-900">Sign in to your store</h1>

        <div className="mb-5 flex gap-2.5" aria-label="Choose account type">
          <button
            type="button"
            className={`flex-1 rounded-lg border px-3 py-2.5 font-semibold ${selectedRole === 'customer' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-slate-100 text-slate-800'}`}
            onClick={() => setSelectedRole('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg border px-3 py-2.5 font-semibold ${selectedRole === 'admin' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-slate-100 text-slate-800'}`}
            onClick={() => setSelectedRole('admin')}
          >
            Admin
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>{selectedRole === 'admin' ? 'Admin username' : 'Customer username'}</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              type="text"
              name="username"
              placeholder={selectedRole === 'admin' ? 'admin' : 'customer'}
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-2 font-semibold text-slate-800">
            <span>Password</span>
            <input
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              type="password"
              name="password"
              placeholder={selectedRole === 'admin' ? 'admin123' : 'customer123'}
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {error && <p className="m-0 text-sm text-red-700">{error}</p>}

          <button type="submit" className="w-full rounded-lg bg-slate-900 px-3.5 py-3 font-bold text-white hover:bg-slate-700">
            Sign in as {selectedRole}
          </button>
        </form>

        <p className="my-5 text-center text-sm leading-relaxed text-slate-600">
          Demo credentials: <strong>admin / admin123</strong> or <strong>customer / customer123</strong>
        </p>
        <p className="mt-2.5 text-center text-sm leading-relaxed text-slate-600">
          New customer?{' '}
          <button type="button" className="p-0 font-bold text-slate-900 underline" onClick={onSwitchToRegister}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
}
