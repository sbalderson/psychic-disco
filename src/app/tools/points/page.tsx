"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, X, Info } from 'lucide-react';
import Link from 'next/link';

interface PointsConfig {
  baseRate: {
    name: string;
    value: number;
  };
  spendMultiplier: {
    name: string;
    value: number;
  };
  profileRate: {
    name: string;
    value: number;
  };
  bonusRate: {
    name: string;
    value: number;
  };
}

interface TooltipProps {
  content: string;
}

function Tooltip({ content }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2 left-1/2">
        {content}
      </div>
    </div>
  );
}

function FormulaCircle({ label, sublabel, name, color, tooltip }: { label: string; sublabel?: string; name: string; color: string; tooltip: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-full ${color} text-white mb-2`}>
        <div className="text-sm font-medium">{label}</div>
        {sublabel && (
          <div className="text-xs opacity-80">{sublabel}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{name}</div>
        <Tooltip content={tooltip} />
      </div>
    </div>
  );
}

export default function PointsProfileBuilder() {
  const [config, setConfig] = useState<PointsConfig>({
    baseRate: {
      name: "Base Rate",
      value: 1
    },
    spendMultiplier: {
      name: "Spend Amount",
      value: 10
    },
    profileRate: {
      name: "Profile Rate",
      value: 100
    },
    bonusRate: {
      name: "Bonus Rate",
      value: 100
    }
  });

  const [previewAmount, setPreviewAmount] = useState<number>(10);
  const [calculatedPoints, setCalculatedPoints] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Calculate points whenever config or preview amount changes
  useEffect(() => {
    const points = (previewAmount / config.baseRate.value) * 
                  (config.profileRate.value / 100) * 
                  (config.bonusRate.value / 100);
    
    // Validate that points value doesn't exceed spend amount
    const pointValue = points * config.baseRate.value;
    if (pointValue > previewAmount) {
      setError(`Warning: Points value ($${pointValue.toFixed(2)}) exceeds spend amount ($${previewAmount.toFixed(2)})`);
    } else {
      setError(null);
    }
    
    setCalculatedPoints(points);
  }, [config, previewAmount]);

  const updateConfig = (key: keyof PointsConfig, field: 'name' | 'value', newValue: string | number) => {
    setConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: newValue
      }
    }));
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Points Profile Builder</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Configure points earning formula based on spend amount</p>
        </div>

        {/* Visual Formula Representation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Points Formula Visualization</h2>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto py-4">
            <FormulaCircle 
              label={`$${config.baseRate.value}`}
              sublabel="= 1 Point"
              name={config.baseRate.name}
              color="bg-yellow-400 dark:bg-yellow-500"
              tooltip="The base exchange rate for converting spend to points"
            />
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <FormulaCircle 
              label={`$${config.spendMultiplier.value}`}
              name={config.spendMultiplier.name}
              color="bg-green-400 dark:bg-green-500"
              tooltip="The amount spent by the customer"
            />
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <FormulaCircle 
              label={`${config.profileRate.value}%`}
              name={config.profileRate.name}
              color="bg-pink-400 dark:bg-pink-500"
              tooltip="Profile-specific multiplier (e.g., VIP status bonus)"
            />
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <FormulaCircle 
              label={`${config.bonusRate.value}%`}
              name={config.bonusRate.name}
              color="bg-purple-400 dark:bg-purple-500"
              tooltip="Additional bonus multiplier (e.g., special promotions)"
            />
            <X className="w-6 h-6 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <FormulaCircle 
              label={calculatedPoints.toFixed(0)}
              name="Final Points"
              color="bg-blue-400 dark:bg-blue-500"
              tooltip="Total points earned from this transaction"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Configuration Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Points Formula Configuration</h2>
                  <Tooltip content="Configure the rates and multipliers that determine how points are earned. The total value of points earned cannot exceed the spend amount." />
                </div>
                
                <div className="space-y-4">
                  {/* Base Rate */}
                  <div className="space-y-2">
                    <div>
                      <label 
                        htmlFor="base-rate-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Base Rate Name
                      </label>
                      <input
                        id="base-rate-name"
                        type="text"
                        value={config.baseRate.name}
                        onChange={(e) => updateConfig('baseRate', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="base-rate-value"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Base Rate Value ($ per 1 point)
                      </label>
                      <input
                        id="base-rate-value"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={config.baseRate.value}
                        onChange={(e) => updateConfig('baseRate', 'value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Spend Multiplier */}
                  <div className="space-y-2">
                    <div>
                      <label 
                        htmlFor="spend-multiplier-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Spend Multiplier Name
                      </label>
                      <input
                        id="spend-multiplier-name"
                        type="text"
                        value={config.spendMultiplier.name}
                        onChange={(e) => updateConfig('spendMultiplier', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="spend-multiplier-value"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Spend Multiplier Value ($)
                      </label>
                      <input
                        id="spend-multiplier-value"
                        type="number"
                        min="0"
                        value={config.spendMultiplier.value}
                        onChange={(e) => updateConfig('spendMultiplier', 'value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Profile Rate */}
                  <div className="space-y-2">
                    <div>
                      <label 
                        htmlFor="profile-rate-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Profile Rate Name
                      </label>
                      <input
                        id="profile-rate-name"
                        type="text"
                        value={config.profileRate.name}
                        onChange={(e) => updateConfig('profileRate', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="profile-rate-value"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Profile Rate Value (%)
                      </label>
                      <input
                        id="profile-rate-value"
                        type="number"
                        min="0"
                        max="100"
                        value={config.profileRate.value}
                        onChange={(e) => updateConfig('profileRate', 'value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  {/* Bonus Rate */}
                  <div className="space-y-2">
                    <div>
                      <label 
                        htmlFor="bonus-rate-name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Bonus Rate Name
                      </label>
                      <input
                        id="bonus-rate-name"
                        type="text"
                        value={config.bonusRate.name}
                        onChange={(e) => updateConfig('bonusRate', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label 
                        htmlFor="bonus-rate-value"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Bonus Rate Value (%)
                      </label>
                      <input
                        id="bonus-rate-value"
                        type="number"
                        min="0"
                        max="100"
                        value={config.bonusRate.value}
                        onChange={(e) => updateConfig('bonusRate', 'value', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Calculator */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Points Calculator
                  </h2>
                  <Tooltip content="Test your points configuration with different spend amounts" />
                </div>

                <div className="mb-4">
                  <label 
                    htmlFor="preview-amount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Test Spend Amount ($)
                  </label>
                  <input
                    id="preview-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={previewAmount}
                    onChange={(e) => setPreviewAmount(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Formula Breakdown:</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>1. {config.baseRate.name}: ${config.baseRate.value} = 1 Point</p>
                    <p>2. Spend Amount: ${previewAmount}</p>
                    <p>3. {config.profileRate.name}: {config.profileRate.value}%</p>
                    <p>4. {config.bonusRate.name}: {config.bonusRate.value}%</p>
                    
                    {error && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded">
                        {error}
                      </div>
                    )}
                    
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                      <p className="text-blue-700 dark:text-blue-300 font-medium">
                        Points Earned: {calculatedPoints.toFixed(2)} points
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Points Value: ${(calculatedPoints * config.baseRate.value).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 