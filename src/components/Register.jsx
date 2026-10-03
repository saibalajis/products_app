import { useState } from 'react';

export default function Register({ onRegister, onSwitchToLogin }) {
	const [formData, setFormData] = useState({
		username: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((previous) => ({ ...previous, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const username = formData.username.trim();

		if (!username || !formData.password || !formData.confirmPassword) {
			setError('Please complete all fields.');
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters.');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		setError('');
		onRegister({ username, password: formData.password });
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
			<div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 max-[600px]:p-6">
				<p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">New customer</p>
				<h1 className="mb-5 text-3xl font-bold text-slate-900">Create your account</h1>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<label className="flex flex-col gap-2 font-semibold text-slate-800">
						<span>Username</span>
						<input
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							type="text"
							name="username"
							placeholder="Choose a username"
							value={formData.username}
							onChange={handleChange}
							autoComplete="username"
						/>
					</label>

					<label className="flex flex-col gap-2 font-semibold text-slate-800">
						<span>Password</span>
						<input
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							type="password"
							name="password"
							placeholder="At least 6 characters"
							value={formData.password}
							onChange={handleChange}
							autoComplete="new-password"
						/>
					</label>

					<label className="flex flex-col gap-2 font-semibold text-slate-800">
						<span>Confirm password</span>
						<input
							className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 font-normal outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
							type="password"
							name="confirmPassword"
							placeholder="Re-enter your password"
							value={formData.confirmPassword}
							onChange={handleChange}
							autoComplete="new-password"
						/>
					</label>

					{error && <p className="m-0 text-sm text-red-700">{error}</p>}

					<button type="submit" className="w-full rounded-lg bg-slate-900 px-3.5 py-3 font-bold text-white hover:bg-slate-700">
						Create account
					</button>
				</form>

				<p className="my-5 text-center text-sm leading-relaxed text-slate-600">
					Already have an account?{' '}
					<button type="button" className="p-0 font-bold text-slate-900 underline" onClick={onSwitchToLogin}>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}
