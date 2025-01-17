"use client";

import { useState } from 'react';
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface ImporterState {
  isLoading: boolean;
  error: string | null;
  spaceUrl: string | null;
  spaceId: string | null;
}

export default function ImporterPage() {
  const [state, setState] = useState<ImporterState>({
    isLoading: false,
    error: null,
    spaceUrl: null,
    spaceId: null
  });

  const handleImportClick = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/flatfile/create-space', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create import space');
      }

      setState(prev => ({
        ...prev,
        spaceUrl: data.spaceUrl,
        spaceId: data.spaceId,
        isLoading: false
      }));

      // Open Flatfile in a new window
      if (data.spaceUrl) {
        window.open(data.spaceUrl, '_blank');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        isLoading: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account Importer</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Import and manage your account data using our secure importer
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="prose dark:prose-invert">
              <h2 className="text-lg font-medium">Import Instructions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click the button below to open the import interface</li>
                <li>Upload your CSV file or paste your data</li>
                <li>Review and validate your data</li>
                <li>Submit when ready</li>
              </ul>
            </div>

            {state.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600 dark:text-red-400">
                {state.error}
              </div>
            )}

            <button
              onClick={handleImportClick}
              disabled={state.isLoading}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Creating Import Space...
                </>
              ) : (
                'Start Import'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 