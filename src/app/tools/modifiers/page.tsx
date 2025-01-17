"use client";

import { useState } from 'react';
import { ArrowLeft, Upload, Loader2, Download, FileText, X, Scan, ListFilter, ChefHat } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  name: string;
  description: string;
  modifiers: {
    category: string;
    items: string[];
  }[];
}

interface ModifierItem {
  text: string;
  selected: boolean;
}

interface ImageResult {
  filename: string;
  success: boolean;
  items?: MenuItem[];
  rawText?: string;
  error?: string;
}

interface MenuAnalysis {
  totalProcessed: number;
  successfulProcessed: number;
  results: ImageResult[];
}

interface ConsolidatedModifiers {
  [category: string]: ModifierItem[];
}

interface ProcessingStage {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function ModifiersExtractor() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<MenuAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consolidatedModifiers, setConsolidatedModifiers] = useState<ConsolidatedModifiers>({});
  const [currentStage, setCurrentStage] = useState(0);

  const processingStages: ProcessingStage[] = [
    {
      icon: <Scan className="w-12 h-12 text-blue-500 animate-pulse" />,
      title: "Scanning Menu",
      description: "Bepoz Chef AI is reading your menu... 🔍"
    },
    {
      icon: <ListFilter className="w-12 h-12 text-purple-500 animate-bounce" />,
      title: "Analyzing Items",
      description: "Our AI chef is identifying all menu items... 🍽️"
    },
    {
      icon: <ChefHat className="w-12 h-12 text-green-500 animate-spin" />,
      title: "Extracting Modifiers",
      description: "Organizing ingredients and modifiers... 👨‍🍳"
    }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
      setError(null);
      setAnalysis(null);
    }
  };

  const processImages = async () => {
    if (selectedImages.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setCurrentStage(0);

    const formData = new FormData();
    selectedImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      // Set up the 9-second animation sequence
      const stageInterval = setInterval(() => {
        setCurrentStage(prev => (prev < processingStages.length - 1 ? prev + 1 : prev));
      }, 3000); // 3 seconds per stage, total 9 seconds

      // Start the API call
      const response = await fetch('/api/modifiers/extract', {
        method: 'POST',
        body: formData,
      });

      // Ensure minimum 9 seconds of animation
      await new Promise(resolve => setTimeout(resolve, 9000));
      clearInterval(stageInterval);

      if (!response.ok) {
        throw new Error('Failed to process images');
      }

      const result = await response.json();
      setAnalysis(result);
      
      // Combine items from all successful results
      const allItems = result.results
        .filter((r: ImageResult) => r.success && r.items)
        .flatMap((r: ImageResult) => r.items || []);
        
      setConsolidatedModifiers(consolidateModifiers(allItems));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
      setCurrentStage(0);
    }
  };

  const consolidateModifiers = (items: MenuItem[]): ConsolidatedModifiers => {
    const consolidated: ConsolidatedModifiers = {};
    
    items.forEach(item => {
      item.modifiers.forEach(mod => {
        if (!consolidated[mod.category]) {
          consolidated[mod.category] = [];
        }
        mod.items.forEach(ingredient => {
          const exists = consolidated[mod.category].some(
            item => item.text.toLowerCase() === ingredient.toLowerCase()
          );
          if (!exists) {
            consolidated[mod.category].push({
              text: ingredient,
              selected: false
            });
          }
        });
      });
    });

    Object.keys(consolidated).forEach(category => {
      consolidated[category].sort((a, b) => a.text.localeCompare(b.text));
    });

    return consolidated;
  };

  const toggleItemSelection = (category: string, index: number) => {
    setConsolidatedModifiers(prev => ({
      ...prev,
      [category]: prev[category].map((item, i) => 
        i === index ? { ...item, selected: !item.selected } : item
      )
    }));
  };

  function exportToCSV(modifiers: ConsolidatedModifiers) {
    // Convert the modifiers object to CSV rows
    const rows: string[] = [];
    
    // Add header row
    rows.push('Category,Item');
    
    // Process each category and its items
    Object.entries(modifiers).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.selected) {
          // Add the original item row
          rows.push(`${category},${item.text}`);
          // Add the HOLD row
          rows.push(`${category},HOLD ${item.text}`);
        }
      });
    });
    
    // Create and download the CSV file
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'modifiers.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStage + 1) / processingStages.length) * 100}%` }}
                />
              </div>
              
              {/* Current Stage */}
              <div className="text-center mb-6">
                {processingStages[currentStage].icon}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                  {processingStages[currentStage].title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                  {processingStages[currentStage].description}
                </p>
              </div>

              {/* Stage Pills */}
              <div className="flex justify-center gap-2">
                {processingStages.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStage 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Modifiers Extractor</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload a menu image to extract and categorize modifiers
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all hover:shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <label className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="hidden"
                aria-label="Upload menu images"
              />
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mt-2 text-base font-medium text-gray-900 dark:text-white">Click to upload menu images</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            </label>
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-64 h-64 group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <button
                      onClick={() => {
                        const newImages = selectedImages.filter((_, i) => i !== index);
                        const newPreviews = imagePreviews.filter((_, i) => i !== index);
                        setSelectedImages(newImages);
                        setImagePreviews(newPreviews);
                        URL.revokeObjectURL(preview);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={processImages}
              disabled={selectedImages.length === 0 || isProcessing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Processing Menu...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Extract Modifiers
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-xl border border-red-200 dark:border-red-800">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && analysis.results.some(r => r.success && r.items && r.items.length > 0) && (
          <div className="space-y-8">
            {/* Extracted Dish Names */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Extracted Dishes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.results
                  .filter(r => r.success && r.items)
                  .flatMap(r => r.items || [])
                  .map((item, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Consolidated Modifiers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Modifiers
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Consolidated list of all unique modifiers by category
                  </p>
                </div>
                <button
                  onClick={() => exportToCSV(consolidatedModifiers)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(consolidatedModifiers).map(([category, items], index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`${category}-${i}`}
                            checked={item.selected}
                            onChange={() => toggleItemSelection(category, i)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
                          />
                          <label
                            htmlFor={`${category}-${i}`}
                            className="text-gray-600 dark:text-gray-300 select-none cursor-pointer"
                          >
                            {item.text}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 