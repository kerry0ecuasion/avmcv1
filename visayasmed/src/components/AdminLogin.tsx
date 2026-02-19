import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      // Provide user-friendly error messages for common Firebase errors
      let errorMessage = 'Login failed';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email or create an account in Firebase.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This user account has been disabled.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-500 to-sky-700 dark:from-sky-800 dark:to-sky-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md transition-colors duration-300">
        <div className="text-center mb-8">
          <img src="/VMlogo.png" alt="VM Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">VisayasMed Hospital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600 transition-colors duration-300"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-600 transition-colors duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <strong>📋 Setup Instructions:</strong>
          </p>
          <ol className="text-xs text-gray-600 dark:text-gray-300 space-y-2 list-decimal list-inside">
            <li>Go to Firebase Console: console.firebase.google.com</li>
            <li>Open "Authentication" → "Users" tab</li>
            <li>Click "Add user"</li>
            <li>Enter Email: <code className="bg-gray-200 dark:bg-gray-700 px-1">admin@visayasmed.com</code></li>
            <li>Set a password (e.g., Admin@123)</li>
            <li>Use those credentials to login here</li>
          </ol>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
            💡 Tip: Make sure you're in the correct Firebase project (visayasmed-53bbc)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
