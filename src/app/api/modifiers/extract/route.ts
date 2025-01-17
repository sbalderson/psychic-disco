import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

interface MenuItem {
  name: string;
  description: string;
  modifiers: {
    category: string;
    items: string[];
  }[];
}

// Helper function to clean and normalize text
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '')
    .replace(/\s*\(optional\)$/i, '');
}

// Helper function to remove duplicates while preserving case
function uniquePreservingCase(items: string[]): string[] {
  const seen = new Map<string, string>();
  
  for (const item of items) {
    const normalized = normalizeText(item);
    // Keep the version with the most detailed text
    if (!seen.has(normalized) || item.length > seen.get(normalized)!.length) {
      seen.set(normalized, item);
    }
  }
  
  return Array.from(seen.values());
}

function extractModifiersFromDescription(description: string): Map<string, Set<string>> {
  const modifierMap = new Map<string, Set<string>>();
  
  // Initialize categories
  modifierMap.set('Sauces', new Set<string>());
  modifierMap.set('Cheeses', new Set<string>());
  modifierMap.set('Meats', new Set<string>());
  modifierMap.set('Vegetables', new Set<string>());
  modifierMap.set('Seasonings', new Set<string>());
  
  // First, clean the description
  const cleanDescription = normalizeText(description);
  
  // Split on multiple delimiters and clean each part
  const parts = cleanDescription
    .split(/,|\sand\s|with|\+/)
    .map(part => part.trim())
    .filter(part => part.length > 0);
  
  for (const part of parts) {
    // Skip common filler words
    if (/^(the|a|an|our|fresh|premium|special|house)$/.test(part)) {
      continue;
    }
    
    const cleanPart = normalizeText(part);
    
    // Categorize the ingredient
    if (cleanPart.includes('sauce') || cleanPart.includes('oil') || cleanPart.includes('gravy')) {
      modifierMap.get('Sauces')?.add(part);
    }
    else if (cleanPart.includes('cheese') || cleanPart.includes('mozzarella') || cleanPart.includes('ricotta')) {
      modifierMap.get('Cheeses')?.add(part);
    }
    else if (cleanPart.includes('chicken') || cleanPart.includes('bacon') || 
             cleanPart.includes('ham') || cleanPart.includes('salami') || 
             cleanPart.includes('pepperoni') || cleanPart.includes('prawns') ||
             cleanPart.includes('chorizo') || cleanPart.includes('sausage') ||
             cleanPart.includes('meatball')) {
      modifierMap.get('Meats')?.add(part);
    }
    else if (cleanPart.includes('mushroom') || cleanPart.includes('olive') || 
             cleanPart.includes('spinach') || cleanPart.includes('capsicum') ||
             cleanPart.includes('onion') || cleanPart.includes('artichoke') ||
             cleanPart.includes('jalapeno')) {
      modifierMap.get('Vegetables')?.add(part);
    }
    else if (cleanPart.includes('garlic') || cleanPart.includes('oregano') ||
             cleanPart.includes('chili') || cleanPart.includes('chipotle')) {
      modifierMap.get('Seasonings')?.add(part);
    }
  }
  
  // Clean up empty categories and remove duplicates
  for (const [category, items] of Array.from(modifierMap.entries())) {
    if (items.size === 0) {
      modifierMap.delete(category);
    } else {
      // Convert to array, remove duplicates, and back to Set
      const uniqueItems = uniquePreservingCase(Array.from(items));
      modifierMap.set(category, new Set(uniqueItems));
    }
  }
  
  return modifierMap;
}

function parseMenuItems(text: string): MenuItem[] {
  const lines = text.split('\n').filter(line => line.trim());
  const menuItems: MenuItem[] = [];
  let currentItem: MenuItem | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = normalizeText(lines[i]);
    
    // Skip pricing and header lines
    if (line.includes('$') || 
        /^(menu|specials?|pizza|flame-grilled meals)$/i.test(line) ||
        line.length < 2) {
      continue;
    }
    
    // Check if this is a menu item name
    if (line === line.toUpperCase() || 
        (i + 1 < lines.length && lines[i + 1].includes(','))) {
      
      if (currentItem) {
        menuItems.push(currentItem);
      }
      
      currentItem = {
        name: lines[i].trim(),
        description: '',
        modifiers: []
      };
    } 
    // If we have a current item and this line isn't a price
    else if (currentItem && !line.includes('$')) {
      currentItem.description = currentItem.description
        ? `${currentItem.description}, ${lines[i].trim()}`
        : lines[i].trim();
        
      // Extract modifiers from the complete description
      const modifierMap = extractModifiersFromDescription(currentItem.description);
      
      // Convert the map to our modifier array format
      currentItem.modifiers = Array.from(modifierMap.entries())
        .map(([category, items]) => ({
          category,
          items: uniquePreservingCase(Array.from(items))
        }))
        .filter(modifier => modifier.items.length > 0);
    }
  }
  
  // Add the last item
  if (currentItem) {
    menuItems.push(currentItem);
  }
  
  return menuItems;
}

// Initialize Vision API client with credentials JSON
const visionClient = new ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}')
});

async function performOCR(imageBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting OCR process...');
    const [result] = await visionClient.textDetection({
      image: { content: imageBuffer.toString('base64') }
    });
    
    if (!result.fullTextAnnotation?.text) {
      throw new Error('No text found in image');
    }
    
    return result.fullTextAnnotation.text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received image upload request');
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      console.log('No image files provided in request');
      return NextResponse.json(
        { error: 'No image files provided' },
        { status: 400 }
      );
    }

    console.log(`Processing ${files.length} images`);
    
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          console.log('Processing image:', file.name, 'Size:', file.size, 'bytes');
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Perform OCR on the image
          const extractedText = await performOCR(buffer);
          
          // Parse the extracted text into menu items
          const items = parseMenuItems(extractedText);
          
          console.log('Successfully processed image:', file.name, 'found', items.length, 'menu items');
          return {
            filename: file.name,
            success: true,
            items,
            rawText: extractedText
          };
        } catch (error) {
          console.error('Error processing image:', file.name, error);
          return {
            filename: file.name,
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process image'
          };
        }
      })
    );

    // Check if all images failed
    if (results.every(result => !result.success)) {
      return NextResponse.json(
        { error: 'Failed to process all images', results },
        { status: 500 }
      );
    }

    // Return all results, including both successful and failed ones
    return NextResponse.json({
      totalProcessed: files.length,
      successfulProcessed: results.filter(r => r.success).length,
      results
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 