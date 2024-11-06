import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { Save } from 'lucide-react';

const PreferenceForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    hometown: '',
    hobbies: [] as string[],
    mealType: 'Vegetarian' as 'Vegetarian' | 'Non-Vegetarian'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      navigate('/login');
      return;
    }

    try {
      const preferenceData = {
        userId: user._id,
        ...formData
      };

      await axios.post('http://localhost:5000/api/preferences', preferenceData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleHobbyChange = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }));
  };

  const hobbiesList = ['Badminton', 'Cricket', 'Reading', 'Gaming', 'Music'];
  const hometownsList = ['Andhra Pradesh', 'Arunachal Pradesh', 'Delhi', 'Mumbai'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Save className="h-10 w-10 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Your Preferences
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hometown
              </label>
              <select
                value={formData.hometown}
                onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select hometown</option>
                {hometownsList.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hobbies
              </label>
              <div className="grid grid-cols-2 gap-2">
                {hobbiesList.map((hobby) => (
                  <label
                    key={hobby}
                    className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.hobbies.includes(hobby)}
                      onChange={() => handleHobbyChange(hobby)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{hobby}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <div className="flex space-x-4">
                {['Vegetarian', 'Non-Vegetarian'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={type}
                      checked={formData.mealType === type}
                      onChange={(e) => setFormData({ ...formData, mealType: e.target.value as 'Vegetarian' | 'Non-Vegetarian' })}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;