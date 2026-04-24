
import React from 'react';

const DemoInfoBox = () => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-8 rounded-r shadow-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 font-medium">
            Demo Project Notice:
          </p>
          <p className="text-sm text-red-600 mt-1">
            This is a demonstration project. All content, products, and contact information displayed here are for illustrative purposes only and contain dummy data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoInfoBox;
