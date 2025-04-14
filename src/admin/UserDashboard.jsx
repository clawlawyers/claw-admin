import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { NODE_API_ENDPOINT } from '../utils/utils';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const UserDashboard = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`${NODE_API_ENDPOINT}/admin/users/${userId}`);
        console.log('API Response:', res.data);
        if (res.data.success) {
          const user = res.data.data.user;
          console.log('User data:', user);
          setUserData(user);
        } else {
          toast.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error("Error loading user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  console.log('Current userData state:', userData);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/30">
      <div className="container mx-auto px-4 py-8 overflow-hidden">
        <div className="space-y-6">
          {/* User Header */}
          <div className="bg-black/30 rounded-lg shadow-md p-6 border border-teal-500">
            <h1 className="text-2xl font-bold text-white mb-4">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-teal-500">Phone Number</p>
                <p className="text-xl font-semibold text-white break-all">
                  {userData?.phoneNumber || 'No phone number'}
                </p>
              </div>
              <div>
                <p className="text-teal-500">User ID</p>
                <p className="text-xl font-semibold text-white break-all">{userData?.mongoId}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-black/30 rounded-lg shadow-md p-6 border border-teal-500">
            <h2 className="text-xl font-bold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-teal-500">Name</p>
                <p className="text-lg font-semibold text-white break-all">
                  {userData.personalInfo.firstName || userData.personalInfo.lastName ? 
                    `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}` : 
                    'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-teal-500">Email</p>
                <p className="text-lg font-semibold text-white break-all">
                  {userData.personalInfo.email || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-teal-500">College Name</p>
                <p className="text-lg font-semibold text-white break-all">
                  {userData.personalInfo.collegeName || 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-teal-500">State Location</p>
                <p className="text-lg font-semibold text-white break-all">
                  {userData.personalInfo.stateLocation || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Engagement Statistics */}
          <div className="bg-black/30 rounded-lg shadow-md p-6 border border-teal-500">
            <h2 className="text-xl font-bold text-white mb-4">Overall Engagement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-teal-500">Daily</p>
                <p className="text-lg font-semibold text-white">
                  {userData.engagement.overall.daily} minutes
                </p>
              </div>
              <div>
                <p className="text-teal-500">Monthly</p>
                <p className="text-lg font-semibold text-white">
                  {userData.engagement.overall.monthly} hours
                </p>
              </div>
              <div>
                <p className="text-teal-500">Yearly</p>
                <p className="text-lg font-semibold text-white">
                  {userData.engagement.overall.yearly} hours
                </p>
              </div>
              <div>
                <p className="text-teal-500">Total</p>
                <p className="text-lg font-semibold text-white">
                  {userData.engagement.overall.total} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-black/30 rounded-lg shadow-md p-6 border border-teal-500">
            <h2 className="text-xl font-bold text-white mb-4">Recent Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-500">
                    <th className="p-3 text-left text-teal-500">Date</th>
                    <th className="p-3 text-left text-teal-500">Session Name</th>
                    <th className="p-3 text-left text-teal-500">Last Message</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.recentSessions.map((session) => (
                    <tr key={session.id} className="border-b border-teal-600/30">
                      <td className="p-3 text-white whitespace-nowrap">
                        {dayjs(session.updatedAt).format('YYYY-MM-DD HH:mm')}
                      </td>
                      <td className="p-3 text-white break-all">
                        {session.name}
                      </td>
                      <td className="p-3 text-white break-words">
                        {session.recentMessages[0]?.text.substring(0, 100)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;