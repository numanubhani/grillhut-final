import React, { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LocationPrompt: React.FC = () => {
  const { setDeliveryLocation } = useApp();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if location was already requested today
    const lastLocationRequest = localStorage.getItem('last-location-request');
    const today = new Date().toDateString();
    
    // Only show prompt if not requested today and location not set
    if (lastLocationRequest !== today && !navigator.geolocation) {
      // Geolocation not supported
      return;
    }

    if (lastLocationRequest !== today) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowLocation = () => {
    setIsRequesting(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setIsRequesting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get readable address using reverse geocoding
          // Using a free service (Nominatim) - no API key required
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'GrillHutApp/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.display_name) {
              setDeliveryLocation(data.display_name);
            } else {
              // Fallback to coordinates
              setDeliveryLocation(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } else {
            // Fallback to coordinates
            setDeliveryLocation(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
          
          localStorage.setItem('last-location-request', new Date().toDateString());
          setShowPrompt(false);
        } catch (error) {
          console.error('Error getting location:', error);
          // Fallback: just use coordinates
          setDeliveryLocation(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          localStorage.setItem('last-location-request', new Date().toDateString());
          setShowPrompt(false);
        } finally {
          setIsRequesting(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsRequesting(false);
        setShowPrompt(false);
        localStorage.setItem('last-location-request', new Date().toDateString());
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('last-location-request', new Date().toDateString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[200] animate-in slide-in-from-top duration-300">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">Enable Location</h3>
            <p className="text-xs text-zinc-500 mb-3">
              Allow us to access your location for faster delivery address setup
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAllowLocation}
                disabled={isRequesting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                {isRequesting ? 'Getting...' : 'Allow'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-semibold text-sm transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;

