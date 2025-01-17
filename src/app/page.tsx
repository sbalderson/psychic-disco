"use client";

import Link from "next/link";
import { Settings, Coins, Users, Ticket, Calendar, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Bepoz Implementation Tools</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Internal tools for streamlining Bepoz implementation and customer onboarding
        </p>

        {/* Tools Sections */}
        <div className="space-y-8">
          {/* Builders Section */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Builders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Points Profile Builder */}
              <Link 
                href="/tools/points"
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Coins className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Points Profile Builder</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure points earn and redeem rates</p>
              </Link>

              {/* Modifiers Extractor */}
              <Link 
                href="/tools/modifiers"
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Modifiers Extractor</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Extract modifiers from menu images</p>
              </Link>
            </div>
          </div>

          {/* Importers Section */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Importers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Account Importer */}
              <Link 
                href="/tools/importer"
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Account Importer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Import and format customer account data</p>
              </Link>

              {/* Voucher Importer */}
              <Link 
                href="/tools/voucher"
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                    <Ticket className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Voucher Importer</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Import and format voucher data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
