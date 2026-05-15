import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
