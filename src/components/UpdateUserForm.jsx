import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import for translations

const UpdateUserForm = ({ user, onClose, onUserUpdated }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // useTranslation hook to get translation functions

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      newEmail: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, t('name_min')) // Translated validation message
        .required(t('name_required')), // Translated validation message
      email: Yup.string().email(t('email_invalid')) // Translated validation message
        .required(t('email_required')), // Translated validation message
      newEmail: Yup.string().email(t('new_email_invalid')) // Translated validation message
        .required(t('new_email_required')), // Translated validation message
    }),
    onSubmit: async (values) => {
      try {
        const { name, email, newEmail } = values;
        const response = await axios.put('http://localhost:5000/api/users/updatedata', { email, name, newEmail }, { withCredentials: true });
        onUserUpdated(prevUsers => prevUsers.map(user => user.email === email ? { ...user, name, email: newEmail } : user));
        alert(t('profile_updated')); // Use translation for success message
        onClose(); // Close the update form after success
      } catch (err) {
        alert(t('error_updating')); // Translated error message
        console.error(err);
      }
    },
  });

  return (
    <div className="mt-8 p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t('update_user')}</h2> {/* Translated Title */}
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">{t('name')}</label> {/* Translated Field Label */}
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
          <label htmlFor="email" className="block text-gray-700">{t('email')}</label> {/* Translated Field Label */}
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
          <label htmlFor="newEmail" className="block text-gray-700">{t('new_email')}</label> {/* Translated Field Label */}
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
            {t('back')} {/* Translated Button */}
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {t('save_changes')} {/* Translated Button */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserForm;
