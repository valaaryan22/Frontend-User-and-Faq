import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateUserForm = ({ user, onClose, onUserUpdated }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      newEmail: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name should be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Please enter a valid email address').required('Email is required'),
      newEmail: Yup.string().email('Please enter a valid new email').required('New email is required'),
    }),
    onSubmit: async (values) => {
      try {
        const { name, email, newEmail } = values;
        const response = await axios.put('http://localhost:5000/api/users/updatedata', { email, name, newEmail }, { withCredentials: true });
        onUserUpdated(prevUsers => prevUsers.map(user => user.email === email ? { ...user, name, email: newEmail } : user));
        alert('User updated successfully!');
        onClose(); // Close the update form after success
      } catch (err) {
        alert('Error updating user');
        console.error(err);
      }
    },
  });

  return (
    <div className="mt-8 p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update User</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="newEmail" className="block text-gray-700">New Email</label>
          <input
            type="email"
            id="newEmail"
            name="newEmail"
            value={formik.values.newEmail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.newEmail && formik.errors.newEmail && <div className="text-red-500 text-sm">{formik.errors.newEmail}</div>}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose} // Close the form without saving
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;
