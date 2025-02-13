// src/HomePage.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UpdateUserForm from './UpdateUserForm';
import PaymentPage from './PaymentPage';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation(); // useTranslation hook for translation
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/getuser', { withCredentials: true });
        setUsers(response.data.users);
      } catch (err) {
        setError(t('error')); // Using translation for error message
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/users/logout', { withCredentials: true });
      navigate('/');
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  const handleDeleteUser = async (email) => {
    const isConfirmed = window.confirm(t('delete_confirmation'));
    if (isConfirmed) {
      try {
        await axios.post('http://localhost:5000/api/users/deleteuser', { email }, { withCredentials: true });
        setUsers(users.filter(user => user.email !== email));
      } catch (err) {
        console.error('Delete Error:', err);
        alert(t('error'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-white mb-8">{t('user_list')}</h1>

          {/* Language Switcher */}
          <div className="text-right mb-4">
            <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Logout Button */}
          <div className="text-right mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            >
              {t('logout')}
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden shadow-xl rounded-lg bg-white">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">{t('id')}</th>
                  <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">{t('name')}</th>
                  <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">{t('email')}</th>
                  <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b text-center hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {t('update')}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedUser && (
            <UpdateUserForm
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onUserUpdated={setUsers}
            />
          )}
        </div>
      </div>
      <PaymentPage />
    </>
  );
};

export default HomePage;
