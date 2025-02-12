import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFAQs, setTotalFAQs] = useState(0);
  const [limit] = useState(10);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch FAQs data with pagination and search
  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/faq`, {
        params: {
          search,
          page,
          limit,
        }
      });
      setFaqs(response.data.faqs);
      setTotalPages(response.data.pagination.totalPages);
      setTotalFAQs(response.data.pagination.totalFAQs);
    } catch (error) {
      console.error('Error fetching FAQs', error);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when search changes
  };

  const handleAddFAQClick = () => {
    navigate('/add-faq'); // Navigate to Add FAQ page when the button is clicked
  };

  const handleDeleteFAQ = async () => {
    if (faqToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/users/delete`, {
          data: { id: faqToDelete.id }
        });
        setFaqToDelete(null);
        setDeleteConfirmation(false);
        fetchFAQs(); // Re-fetch the FAQ list after deletion
      } catch (error) {
        console.error('Error deleting FAQ', error);
      }
    }
  };

  const handleEditFAQ = (id) => {
    navigate(`/update-faq/${id}`); // Navigate to the update page with the FAQ ID
  };

  const handleConfirmDelete = (faq) => {
    setFaqToDelete(faq);
    setDeleteConfirmation(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4 text-center">Frequently Asked Questions</h1>

      <div className="mb-4 flex justify-between items-center">
        <input 
          type="text"
          placeholder="Search FAQs"
          value={search}
          onChange={handleSearchChange}
          className="p-2 border rounded-lg w-1/3"
        />
        <button
          onClick={handleAddFAQClick}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Add FAQ
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Answer</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">{faq.category.faq_cat_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{faq.question}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{faq.answer}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700"
                    onClick={() => handleEditFAQ(faq.id)} // Edit button click
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white mt-2 py-1 px-3 rounded-lg hover:bg-red-700 ml-2"
                    onClick={() => handleConfirmDelete(faq)} // Confirm delete
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal for Deletion */}
      {deleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Are you sure you want to delete this FAQ?</h3>
            <div className="mt-4 flex justify-between">
              <button
                onClick={handleDeleteFAQ}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmation(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQList;
