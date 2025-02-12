import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import FAQList from './components/FAQList';
import AddFAQ from './components/AddFAQ';
import UpdateFAQ from './components/UpdateFAQ';
import DeleteFAQ from './components/DeleteFAQ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* Protect /home route */}
        <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
        
        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<div>404 - Not Found</div>} />
        
        {/* FAQ Routes */}
        <Route path="/faqs" element={<FAQList />} />
        <Route path="/add-faq" element={<AddFAQ />} />
        <Route path="/update-faq/:faqId" element={<UpdateFAQ />} />
        <Route path="/delete-faq/:id" element={<DeleteFAQ />} />
      </Routes>
    </Router>
  );
}

export default App;
