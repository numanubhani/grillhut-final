import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Package, X, Loader2 } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCkZA9qVZJq4qjVM_yB7rad5IV1ir7IhSk';

interface LocationSuggestion {
  formatted_address: string;
  place_id: string;
}

const DeliveryModal: React.FC = () => {
  const { deliveryType, setDeliveryType, deliveryLocation, setDeliveryLocation } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'pickup' | 'delivery' | null>(null);
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Show modal if delivery type is not set
    if (!deliveryType) {
      setShowModal(true);
    } else {
      setShowModal(false);
      setLocation(deliveryLocation);
    }
  }, [deliveryType, deliveryLocation]);

  const fetchLocationSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results) {
        setSuggestions(data.results.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 500);
  };

  const selectSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.formatted_address);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-input-container')) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSuggestions]);

  const handleContinue = () => {
    if (selectedType === 'delivery' && !location.trim()) {
      return; // Don't proceed if delivery is selected but no location
    }
    if (selectedType) {
      setDeliveryType(selectedType);
      if (selectedType === 'delivery' && location.trim()) {
        setDeliveryLocation(location);
      }
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl relative">
        <button
          onClick={() => {
            if (selectedType) {
              handleContinue();
            }
          }}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-serif font-black mb-2">Choose Your Option</h2>
          <p className="text-zinc-500 dark:text-zinc-400">How would you like to receive your order?</p>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedType('pickup')}
            className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'pickup'
                ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedType === 'pickup' ? 'bg-orange-600' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}>
              <Package className={`w-6 h-6 ${selectedType === 'pickup' ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Pick Up</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Collect your order from our store</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedType('delivery')}
            className={`w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
              selectedType === 'delivery'
                ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-orange-300 dark:hover:border-orange-700'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedType === 'delivery' ? 'bg-orange-600' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}>
              <MapPin className={`w-6 h-6 ${selectedType === 'delivery' ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Delivery</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">We'll deliver to your location</p>
            </div>
          </button>
        </div>

        {selectedType === 'delivery' && (
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 ml-1">Delivery Address</label>
            <div className="relative location-input-container">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10" />
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => location.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Enter your delivery address"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
              )}
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 max-h-60 overflow-y-auto z-20">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.place_id || index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <span className="text-sm font-medium">{suggestion.formatted_address}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selectedType || (selectedType === 'delivery' && !location.trim())}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/20 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DeliveryModal;

