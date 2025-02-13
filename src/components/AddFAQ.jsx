import  { useState } from 'react';
import axios from 'axios';

const AddFAQ = () => {
  const [formData, setFormData] = useState({
    cat_id: '',
    question: '',
    answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/faq', formData);
      alert(response.data.message);
      // Optionally, you can redirect or reset the form
    } catch (error) {
      alert('Error adding FAQ');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add a New FAQ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cat_id" className="block text-sm font-medium text-gray-600">Category ID</label>
            <input
              type="number"
              name="cat_id"
              id="cat_id"
              value={formData.cat_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter category ID"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-gray-600">Question</label>
            <input
              type="text"
              name="question"
              id="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your question"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-600">Answer</label>
            <textarea
              name="answer"
              id="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the answer"
              rows="4"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Add FAQ
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFAQ;
