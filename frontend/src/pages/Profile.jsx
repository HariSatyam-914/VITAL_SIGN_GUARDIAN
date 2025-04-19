import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';
import { USER_ENDPOINTS } from '../config';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/layouts/DashboardLayout';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axios.get(USER_ENDPOINTS.PROFILE);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile data. Please try again later.');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(USER_ENDPOINTS.PROFILE, profile);
      setProfile(response.data);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Update user context if name changed
      if (user.firstName !== profile.firstName || user.lastName !== profile.lastName) {
        updateUser({
          ...user,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset any changes
    fetchProfile();
  };

  if (isLoading && !profile.firstName) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiEdit2 className="mr-2" /> Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <FiSave className="mr-2" /> Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FiUser className="mr-2" /> Personal Information
              </h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="flex items-center">
                    <FiMail className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={true} // Email cannot be changed
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <FiPhone className="text-gray-400 mr-2" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Health Information */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Health Information
              </h2>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={profile.height}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={profile.weight}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    value={profile.bloodType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="List any allergies..."
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Medical Information */}
            <div className="neumorphic p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Medical Information
              </h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medical Conditions
                  </label>
                  <textarea
                    name="medicalConditions"
                    value={profile.medicalConditions}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="List any medical conditions..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Medications
                  </label>
                  <textarea
                    name="medications"
                    value={profile.medications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="List any medications you're currently taking..."
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;