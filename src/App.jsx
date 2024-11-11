import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import QuoteListPage from './pages/QuoteListPage';
import CreateQuotePage from './pages/createQuoteList';
import Navbar from './pages/Navbar';

const LoadingSpinner = () => (
  <div className='flex justify-center absolute top-[50%] left-[50%]'>
    <span className="loader"></span>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Navigate to="/quotes" replace /> : children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar onSignOut={logout} />}
      <Routes>
        <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/quotes" element={<ProtectedRoute><QuoteListPage /></ProtectedRoute>} />
        <Route path="/create-quote" element={<ProtectedRoute><CreateQuotePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <AppContent />
        </Router>
      </Suspense>
    </AuthProvider>
  );
}

export default App;