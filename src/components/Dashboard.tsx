import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { UserCircle, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <UserCircle className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                Welcome, {user?.name || 'User'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/preferences')}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Your Preferences
                </h3>
                <p className="text-gray-600 mt-1">
                  Set up your roommate preferences
                </p>
              </div>
              <Settings className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div
            onClick={() => navigate('/matches')}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Find Roommates
                </h3>
                <p className="text-gray-600 mt-1">
                  View your potential matches
                </p>
              </div>
              <UserCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;