import React from 'react';
import axios from 'axios';

const DeleteFAQ = ({ faqId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/delete', { id: faqId });
      alert('FAQ deleted successfully');
      onDelete(); // Callback to update FAQ list after deletion
    } catch (error) {
      alert('Error deleting FAQ');
      console.error(error);
    }
  };

  return (
    <button onClick={handleDelete} className="delete-faq-button">
      Delete FAQ
    </button>
  );
};

export default DeleteFAQ;
