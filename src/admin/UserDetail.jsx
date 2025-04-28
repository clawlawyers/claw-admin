import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NODE_API_ENDPOINT } from '../utils/utils';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${NODE_API_ENDPOINT}/admin/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate('/admin/users')}
        className="flex items-center text-teal-500 hover:text-teal-600 mb-6"
      >
        <ArrowBack className="mr-2" /> Back to Users
      </button>

      <div className="bg-white/10 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>
        
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400">Name</h3>
                <p className="text-lg">{`${user.firstName || ''} ${user.lastName || ''}`}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Phone Number</h3>
                <p className="text-lg">{user.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Location</h3>
                <p className="text-lg">{user.StateLocation || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400">Created At</h3>
                <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Last Updated</h3>
                <p className="text-lg">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400">Engagement Time</h3>
                <p className="text-lg">Daily: {user.engagementTime?.daily || 0} mins</p>
                <p className="text-lg">Monthly: {user.engagementTime?.monthly || 0} mins</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">User not found</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;