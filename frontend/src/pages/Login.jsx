import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(formData.email, formData.password);
      login(response.user, response.token);
      
      // Redirect to admin dashboard if user is admin
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-12 sm:py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg">
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal mb-2">Welcome Back</h1>
          <p className="text-gray-custom mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white py-2 font-semibold hover:bg-gray-custom transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-custom mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-charcoal font-semibold hover:text-gray-custom">
              Create one
            </a>
          </p>

          <p className="text-center text-gray-custom text-sm mt-4">
            Or place an order as a guest via{' '}
            <a href="/checkout" className="text-charcoal font-semibold hover:text-gray-custom">
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
