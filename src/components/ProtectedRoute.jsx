import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ component: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to access a protected route to check if the user is logged in
        await axios.get('http://localhost:5000/api/users/getuser', { withCredentials: true });
        setIsAuthenticated(true); // If successful, the user is authenticated
      } catch (err) {
        setIsAuthenticated(false); // If failed, the user is not authenticated
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally show a loading spinner while checking authentication
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return <Component />; // Render the protected component if authenticated
};

export default ProtectedRoute;
