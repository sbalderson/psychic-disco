import { NextResponse } from 'next/server';

// Use the provided API key and environment ID
const FLATFILE_API_KEY = process.env.FLATFILE_API_KEY || 'pk_XEAOS2NvMzO8zgMdTOqNKCv3c8EHx3XT';
const FLATFILE_ENVIRONMENT_ID = process.env.FLATFILE_ENVIRONMENT_ID || 'us_env_98IfVuny';

export async function POST() {
  try {
    const response = await fetch('https://platform.flatfile.com/api/v1/spaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLATFILE_API_KEY}`
      },
      body: JSON.stringify({
        name: 'Account Import',
        labels: ['accounts'],
        autoConfigure: true,
        environmentId: FLATFILE_ENVIRONMENT_ID,
        sheets: [{
          name: 'Accounts',
          slug: 'accounts',
          fields: [
            { key: 'ACCOUNTID', type: 'string', label: 'Account ID' },
            { key: 'ACCTNUM', type: 'string', label: 'Account Number' },
            { key: 'CARDNUM', type: 'string', label: 'Card Number' },
            { key: 'FIRSTNAME', type: 'string', label: 'First Name' },
            { key: 'LASTNAME', type: 'string', label: 'Last Name' },
            { key: 'EMAIL', type: 'string', label: 'Email' },
            { key: 'PHONE', type: 'string', label: 'Phone' },
            { key: 'ADDRESS1', type: 'string', label: 'Address Line 1' },
            { key: 'ADDRESS2', type: 'string', label: 'Address Line 2' },
            { key: 'CITY', type: 'string', label: 'City' },
            { key: 'STATE', type: 'string', label: 'State' },
            { key: 'ZIP', type: 'string', label: 'ZIP Code' }
          ]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Flatfile API error:', errorData);
      return NextResponse.json(
        { error: `Failed to create space: ${errorData.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      spaceUrl: data.data.accessUrl,
      spaceId: data.data.id
    });
  } catch (error) {
    console.error('Error creating Flatfile space:', error);
    return NextResponse.json(
      { error: 'Failed to create Flatfile space' },
      { status: 500 }
    );
  }
} 