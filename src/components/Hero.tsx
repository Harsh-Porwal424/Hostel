import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-600 flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find your VIT Roommate
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            VIT's Favourite roommate finder.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/preferences')}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add your preference
            </button>
            <button
              onClick={() => navigate('/matches')}
              className="px-8 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Find your roommate
            </button>
          </div>
        </div>
        
        <div className="bg-blue-100 p-6 text-center">
          <p className="text-blue-800">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold hover:text-blue-600"
            >
              Login
            </button>
            {' '} or {' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold hover:text-blue-600"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;