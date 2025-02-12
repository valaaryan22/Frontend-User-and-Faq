import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // useParams to get the ID from URL

const UpdateFAQ = () => {
  const { faqId } = useParams(); // Get FAQ ID from the URL
  const [formData, setFormData] = useState({
    cat_id: '',
    question: '',
    answer: ''
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state for the form
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Fetch FAQ data when component mounts
    const fetchFAQ = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/faq/${faqId}`);
        setFormData({
          cat_id: response.data.faq.cat_id,
          question: response.data.faq.question,
          answer: response.data.faq.answer,
        });
        setIsLoading(false); // Set loading state to false once data is fetched
      } catch (error) {
        console.error('Error fetching FAQ', error);
        setIsLoading(false);
      }
    };
    if (faqId) fetchFAQ();
  }, [faqId]);

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
      const response = await axios.put('http://localhost:5000/api/users/updatefaq', formData);
      alert(response.data.message);
      navigate('/faq-list'); // Redirect to FAQ list page after successful update
    } catch (error) {
      alert('Error updating FAQ');
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Update FAQ</h2>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="cat_id" className="block text-sm font-semibold text-gray-700">Category ID</label>
            <input
              type="number"
              id="cat_id"
              name="cat_id"
              value={formData.cat_id}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="question" className="block text-sm font-semibold text-gray-700">Question</label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="answer" className="block text-sm font-semibold text-gray-700">Answer</label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
          >
            Update FAQ
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateFAQ;
