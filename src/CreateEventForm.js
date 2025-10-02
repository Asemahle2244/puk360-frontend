/**
 * CreateEventForm component for hosts to create new events.
 * Matches the styling of LoginScreen with NWU branding.
 */
import React, { useState } from 'react';
import Button from './components/Button';
import { api } from './api/client';
import './NWUBackground.css';
import nwuLogo from './assets/nwu-logo-round-main.png';

const CreateEventForm = ({ onBack, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setError('');
    setSuccess('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.location || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time into ISO format
      const dateTime = `${formData.date}T${formData.time}:00`;

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create events');
        return;
      }

      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: dateTime,
          status: formData.status
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Event created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          date: '',
          time: '',
          status: 'active'
        });
        
        // Redirect after short delay
        setTimeout(() => {
          if (onEventCreated) onEventCreated();
        }, 1500);
      } else {
        setError(data.message || data.errors?.[0]?.msg || 'Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div className="nwu-background"></div>

      {/* Foreground content */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10 space-y-5">
            <div className="flex items-center space-x-4">
              <img
                src={nwuLogo}
                alt="NWU logo"
                className="w-[68px] h-[68px] rounded-full object-contain ring-2 ring-primary/30 bg-white/80"
              />
              <h1 className="text-5xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PUK360
              </h1>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-secondary text-center">
              Create New Event
            </h2>
          </div>

          {/* Card Container */}
          <div className="relative rounded-2xl border-2 border-primary/50 dark:border-primary-dm/50 overflow-hidden">
            {/* BACKDROP LAYER */}
            <div className="
              absolute inset-0
              bg-primary/6 dark:bg-primary-dm/8
              backdrop-blur-[3px]
              supports-[backdrop-filter:none]:bg-white/92
            " />

            {/* CONTENT LAYER */}
            <div className="relative z-10 p-6 sm:p-8">
              {/* Status messages */}
              {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
              {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
              
              {/* Form Section */}
              <div className="flex flex-col space-y-4 mb-6">
                
                {/* Event Title */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               placeholder-black/40 dark:placeholder-white/40 
                               transition duration-200"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your event"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               placeholder-black/40 dark:placeholder-white/40 
                               transition duration-200 resize-none"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Event location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               placeholder-black/40 dark:placeholder-white/40 
                               transition duration-200"
                  />
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 
                                 bg-white dark:bg-surface-dm
                                 border border-primary/20 dark:border-primary-dm/25 
                                 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                 transition duration-200"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 
                                 bg-white dark:bg-surface-dm
                                 border border-primary/20 dark:border-primary-dm/25 
                                 rounded-xl focus:outline-none focus:ring-2 
                                 focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                                 transition duration-200"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 
                               bg-white dark:bg-surface-dm
                               border border-primary/20 dark:border-primary-dm/25 
                               rounded-xl focus:outline-none focus:ring-2 
                               focus:ring-primary/40 dark:focus:ring-primary-dm/40 
                               transition duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleSubmit} 
                  variant="primary" 
                  fullWidth={true}
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Creating Event...' : 'Create Event'}
                </Button>

                <Button 
                  onClick={onBack}
                  variant="outline" 
                  fullWidth={true}
                  disabled={loading}
                >
                  Back to Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 h-8"></div>
    </div>
  );
};

export default CreateEventForm;