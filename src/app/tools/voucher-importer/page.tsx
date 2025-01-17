"use client";

import { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ImporterState {
  isLoading: boolean;
  error: string | null;
  spaceUrl: string | null;
  spaceId: string | null;
}

export default function VoucherImporterPage() {
  const [state, setState] = useState<ImporterState>({
    isLoading: false,
    error: null,
    spaceUrl: null,
    spaceId: null,
  });

  const createSpace = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/flatfile/create-voucher-space', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            name: 'Voucher Import',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create import space');
      }

      const data = await response.json();
      setState(prev => ({
        ...prev,
        spaceUrl: data.spaceUrl,
        spaceId: data.spaceId,
      }));

      // Open Flatfile in a new window
      window.open(data.spaceUrl, '_blank');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Voucher Importer</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Import and format voucher data using our secure data import tool
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="max-w-xl">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Import Vouchers
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Our secure import tool helps you validate and format your voucher data before importing.
              You can map your columns, preview the data, and ensure everything is correct before proceeding.
            </p>

            {state.error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-md text-sm">
                {state.error}
              </div>
            )}

            <button
              onClick={createSpace}
              disabled={state.isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isLoading ? 'Opening Import Tool...' : 'Start Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 