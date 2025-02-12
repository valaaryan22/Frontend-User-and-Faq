import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UpdateUserForm from './UpdateUserForm'; // Import the UpdateUserForm component

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for update
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/getuser', { withCredentials: true });
        setUsers(response.data.users);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/users/logout', { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };
  const handleDeleteUser = async (email) => {
    // Ask for confirmation before deleting
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    
    if (isConfirmed) {
      try {
        await axios.post('http://localhost:5000/api/users/deleteuser', { email }, { withCredentials: true });
        setUsers(users.filter(user => user.email !== email)); // Remove user from the state
        
      } catch (err) {
        console.error('Delete Error:', err);
        alert('Error deleting user');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
        <div className="text-white text-xl">Loading...</div>
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">User List</h1>

        {/* Logout Button */}
        <div className="text-right mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>

        <div className="overflow-hidden shadow-xl rounded-lg bg-white">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">ID</th>
                <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">Name</th>
                <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">Email</th>
                <th className="px-6 py-3 text-lg font-medium text-gray-900 bg-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b text-center hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-900 flex space-x-2">
                    {/* Update Button */}
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500  text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      Update
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* If a user is selected for update, render the UpdateUserForm component */}
        {selectedUser && (
          <UpdateUserForm 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} // Close the form when user clicks "Back"
            onUserUpdated={setUsers} // Pass the function to update the user list after an update
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
