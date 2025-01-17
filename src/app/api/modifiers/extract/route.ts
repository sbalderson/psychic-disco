"use client";

import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Vision API client with API key
const visionClient = new ImageAnnotatorClient({
  apiEndpoint: 'vision.googleapis.com',
  credentials: {
    client_email: 'menuparser@menuparser-447618.iam.gserviceaccount.com',
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
});

async function performOCR(imageBuffer: Buffer): Promise<string> {
  try {
    const [result] = await visionClient.textDetection({
      image: { content: imageBuffer.toString('base64') }
    });
    
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      throw new Error('No text found in image');
    }
    
    return detections[0].description || '';
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to perform OCR on image');
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Perform OCR on the image
    const extractedText = await performOCR(buffer);
    
    // For now, return the extracted text directly
    return NextResponse.json({
      menuItems: [{
        name: 'Sample Item',
        description: 'Extracted text: ' + extractedText,
        modifiers: []
      }]
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 