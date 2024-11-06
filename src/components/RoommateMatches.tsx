import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Match {
  id: string;
  name: string;
  registrationNo: string;
  phoneNo: string;
  state: string;
  matchPercentage: number;
}

const RoommateMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleConfirmRoommate = async (confirmed: boolean) => {
    if (!selectedMatch) return;

    try {
      await axios.post('http://localhost:5000/api/confirm-roommate', {
        matchId: selectedMatch.id,
        confirmed
      });
      setShowConfirmation(false);
      fetchMatches();
    } catch (error) {
      console.error('Error confirming roommate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Matches Found
        </h2>

        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {match.name}
                  </h3>
                  <p className="text-gray-600">Reg No: {match.registrationNo}</p>
                  <p className="text-gray-600">Phone: {match.phoneNo}</p>
                  <p className="text-gray-600">State: {match.state}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-500">
                    {match.matchPercentage}% match
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMatch(match);
                      setShowConfirmation(true);
                    }}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showConfirmation && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-center mb-4">
                Roommate Selected - {selectedMatch.name}
              </h3>
              <p className="text-center mb-6">
                Do you want to confirm this person?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleConfirmRoommate(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleConfirmRoommate(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoommateMatches;