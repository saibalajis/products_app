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
		<div className="auth-page">
			<div className="auth-card">
				<p className="eyebrow">New customer</p>
				<h1>Create your account</h1>

				<form className="auth-form" onSubmit={handleSubmit}>
					<label className="field-group">
						<span>Username</span>
						<input
							type="text"
							name="username"
							placeholder="Choose a username"
							value={formData.username}
							onChange={handleChange}
							autoComplete="username"
						/>
					</label>

					<label className="field-group">
						<span>Password</span>
						<input
							type="password"
							name="password"
							placeholder="At least 6 characters"
							value={formData.password}
							onChange={handleChange}
							autoComplete="new-password"
						/>
					</label>

					<label className="field-group">
						<span>Confirm password</span>
						<input
							type="password"
							name="confirmPassword"
							placeholder="Re-enter your password"
							value={formData.confirmPassword}
							onChange={handleChange}
							autoComplete="new-password"
						/>
					</label>

					{error && <p className="auth-error">{error}</p>}

					<button type="submit" className="primary-btn">
						Create account
					</button>
				</form>

				<p className="demo-note">
					Already have an account?{' '}
					<button type="button" className="text-btn" onClick={onSwitchToLogin}>
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
}
