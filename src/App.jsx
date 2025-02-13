import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddFAQ from './components/AddFAQ';
import DeleteFAQ from './components/DeleteFAQ';
import FAQList from './components/FAQList';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterForm from './components/RegisterForm';
import UpdateFAQ from './components/UpdateFAQ';
import PaymentPage from './components/PaymentPage'; // Import the PaymentPage component
import './i18n';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protect /home route */}
          <Route path="/home" element={<ProtectedRoute component={HomePage} />} />

          {/* Add the PaymentPage route */}
          <Route path="/payment" element={<PaymentPage />} />

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<div>404 - Not Found</div>} />

          {/* FAQ Routes */}
          <Route path="/faqs" element={<FAQList />} />
          <Route path="/add-faq" element={<AddFAQ />} />
          <Route path="/update-faq/:faqId" element={<UpdateFAQ />} />
          <Route path="/delete-faq/:id" element={<DeleteFAQ />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
