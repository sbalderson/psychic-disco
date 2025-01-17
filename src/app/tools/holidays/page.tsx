"use client";

import { useState } from 'react';
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

interface HolidayConfig {
  venueId: string;
  state: string;
  turnOnTime: string;
  turnOffTime: string;
  normalPrice: string;
  holidayPrice: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
        <div className="whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white dark:bg-gray-700">
          {content}
          <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default function HolidayBuilder() {
  const [config, setConfig] = useState<HolidayConfig>({
    venueId: '',
    state: '',
    turnOnTime: '00:00',
    turnOffTime: '23:59',
    normalPrice: '',
    holidayPrice: '',
  });
  const [dates, setDates] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Price validation (1-8)
    if ((name === 'normalPrice' || name === 'holidayPrice') && value !== '') {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 1 || numValue > 8) {
        setError(`${name === 'normalPrice' ? 'Normal' : 'Holiday'} price must be between 1 and 8`);
        return;
      }
    }
    
    setConfig(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!config.venueId || isNaN(Number(config.venueId))) {
      setError('Please enter a valid venue ID');
      return false;
    }
    if (!config.state) {
      setError('Please select a state');
      return false;
    }
    
    const normalPrice = Number(config.normalPrice);
    const holidayPrice = Number(config.holidayPrice);
    
    if (!config.normalPrice || isNaN(normalPrice) || normalPrice < 1 || normalPrice > 8) {
      setError('Normal price must be between 1 and 8');
      return false;
    }
    if (!config.holidayPrice || isNaN(holidayPrice) || holidayPrice < 1 || holidayPrice > 8) {
      setError('Holiday price must be between 1 and 8');
      return false;
    }
    
    if (holidayPrice <= normalPrice) {
      setError('Holiday price must be higher than normal price');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // For now, just show some example dates
    // This will be enhanced later to generate actual public holiday dates
    setDates([
      '2024-01-01 New Year\'s Day',
      '2024-01-26 Australia Day',
      '2024-04-25 Anzac Day',
      '2024-12-25 Christmas Day',
      '2024-12-26 Boxing Day',
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Public Holiday Builder</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Configure venue pricing for public holidays
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          {/* Venue ID */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="venueId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Venue ID
              </label>
              <Tooltip content="Enter the numeric ID of the venue">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <input
              type="number"
              id="venueId"
              name="venueId"
              value={config.venueId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              placeholder="Enter venue ID"
            />
          </div>

          {/* State Selection */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State
              </label>
              <Tooltip content="Select the state for public holiday dates">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <select
              id="state"
              name="state"
              value={config.state}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            >
              <option value="">Select a state</option>
              {AUSTRALIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Settings */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Settings
              </label>
              <Tooltip content="Set when the holiday rates should start and end">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="turnOnTime" className="block text-sm text-gray-500 dark:text-gray-400">
                  Start Time
                </label>
                <input
                  type="time"
                  id="turnOnTime"
                  name="turnOnTime"
                  value={config.turnOnTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="turnOffTime" className="block text-sm text-gray-500 dark:text-gray-400">
                  End Time
                </label>
                <input
                  type="time"
                  id="turnOffTime"
                  name="turnOffTime"
                  value={config.turnOffTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Settings
              </label>
              <Tooltip content="Enter price levels (1-8)">
                <Info className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="normalPrice" className="block text-sm text-gray-500 dark:text-gray-400">
                  Normal Price Level
                </label>
                <input
                  type="number"
                  id="normalPrice"
                  name="normalPrice"
                  value={config.normalPrice}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="1-8"
                />
              </div>
              <div>
                <label htmlFor="holidayPrice" className="block text-sm text-gray-500 dark:text-gray-400">
                  Holiday Price Level
                </label>
                <input
                  type="number"
                  id="holidayPrice"
                  name="holidayPrice"
                  value={config.holidayPrice}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  placeholder="1-8"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Generate Holiday Dates
          </button>
        </form>

        {/* Results */}
        {dates.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Public Holidays</h2>
            <ul className="space-y-2">
              {dates.map((date, index) => (
                <li 
                  key={index}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 