import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom'; 
const RegisterForm = () => {
  const navigate = useNavigate();
  // Formik hook
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Name must be at least 3 characters.')
        .max(50, 'Name must be at most 50 characters.')
        .matches(/^[a-zA-Z0-9 ]+$/, 'Name must contain only letters, numbers, and spaces.')
        .required('Name is required.'),
      email: Yup.string()
        .email('Please enter a valid email address.')
        .required('Email is required.'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(20, 'Password must be at most 20 characters long.')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .matches(/[0-9]/, 'Password must contain at least one number.')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&).')
        .required('Password is required.'),
    }),
    onSubmit: async (values) => {
      const userData = { name: values.name, email: values.email, password: values.password };

      try {
        // Sending POST request using Axios
        const response = await axios.post('http://localhost:5000/api/users/register', userData);

        // If registration is successful, show success message and clear form
        if (response) {
          const message = response.data.message; // Assuming the response has the "message" field
          alert(message);  // Show browser alert
          formik.resetForm(); // Reset form after successful registration
          navigate('/login')
        }
      } catch (error) {
        // Handle error and show message if email is already used or any other error
        if (error.response && error.response.data) {
          alert(error.response.data.message || 'An error occurred');
        } else {
          alert('An unexpected error occurred.');
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-300">
        <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Create an Account</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 text-lg font-medium">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className='pt-4 pr-2 text-center'>
        Already have an account?{' '}
        <Link to="/login" className='text-blue-700'>Login here</Link>
      </p>
      </div>

    </div>
  );
};

export default RegisterForm;
