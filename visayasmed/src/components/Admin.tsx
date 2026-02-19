import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Admin: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div className="flex items-center gap-4 mb-6">
          <img src="/VMlogo.png" alt="VM Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Portal</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400">User Management</h2>
            <p className="text-blue-600 dark:text-blue-300 mt-2">Manage users and permissions</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">Content Management</h2>
            <p className="text-green-600 dark:text-green-300 mt-2">Update website content</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-400">Analytics</h2>
            <p className="text-purple-600 dark:text-purple-300 mt-2">View site analytics</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400">Settings</h2>
            <p className="text-yellow-600 dark:text-yellow-300 mt-2">Configure system settings</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-400">Reports</h2>
            <p className="text-red-600 dark:text-red-300 mt-2">Generate reports</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg transition-colors duration-300">
            <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400">Notifications</h2>
            <p className="text-indigo-600 dark:text-indigo-300 mt-2">Send notifications</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Admin;