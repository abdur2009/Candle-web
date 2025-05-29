import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen py-12 bg-neutral-50 flex items-center">
      <div className="container-custom mx-auto text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-7xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-serif font-bold mb-4">Page Not Found</h2>
          <p className="text-neutral-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;