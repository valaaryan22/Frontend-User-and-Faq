import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting after login

const LoginForm = () => {
  const navigate = useNavigate(); // Initialize the navigation hook
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required.'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .required('Password is required.'),
    }),
    onSubmit: async (values) => {
        const userData = { email: values.email, password: values.password };
      
        try {
          // Send POST request to login
          const response = await axios.post('http://localhost:5000/api/users/login', userData, {
            withCredentials: true, // Ensure the cookie is sent with the request
          });
      
          if (response) {
            console.log('Login response:', response.data); // Debugging
            alert(response.data.message); // Success message
            formik.resetForm();
            navigate('/home'); // Redirect to the protected home page after successful login
          }
        } catch (error) {
          if (error.response && error.response.data) {
            alert(error.response.data.message || 'An error occurred');
          } else {
            alert('An unexpected error occurred.');
          }
        }
      }
      
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-pink-500">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-300">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Login</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-lg font-medium">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-gray-700 text-lg font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className='text-blue-700'>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
