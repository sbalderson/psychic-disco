"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your application preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h2>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Theme
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Choose between light and dark mode
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </div>
          </div>

          {/* System Section - Placeholder for future settings */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">System</h2>
              
              <div className="flex items-center justify-between py-3 opacity-50">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Language
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred language (Coming soon)
                  </div>
                </div>
                <button
                  disabled
                  className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white"
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 