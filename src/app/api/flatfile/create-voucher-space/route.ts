import { NextResponse } from 'next/server';

const voucherFields = {
  fields: [
    // Voucher Details
    { key: 'VOUCHERID', type: 'string', label: 'Voucher ID', required: true },
    { key: 'VOUCHERNUMBER', type: 'string', label: 'Voucher Number', required: true },
    { key: 'VOUCHERTYPE', type: 'string', label: 'Voucher Type' },
    { key: 'DESCRIPTION', type: 'string', label: 'Description' },
    { key: 'STATUS', type: 'string', label: 'Status' },
    
    // Value and Limits
    { key: 'FACEVALUE', type: 'number', label: 'Face Value' },
    { key: 'CURRENTVALUE', type: 'number', label: 'Current Value' },
    { key: 'MINSPEND', type: 'number', label: 'Minimum Spend' },
    { key: 'MAXSPEND', type: 'number', label: 'Maximum Spend' },
    { key: 'USAGELIMIT', type: 'number', label: 'Usage Limit' },
    { key: 'USAGECOUNT', type: 'number', label: 'Usage Count' },
    
    // Dates
    { key: 'ISSUEDATE', type: 'date', label: 'Issue Date' },
    { key: 'STARTDATE', type: 'date', label: 'Start Date' },
    { key: 'EXPIRYDATE', type: 'date', label: 'Expiry Date' },
    { key: 'LASTUSEDDATE', type: 'date', label: 'Last Used Date' },
    
    // Account Links
    { key: 'ACCOUNTID', type: 'string', label: 'Account ID' },
    { key: 'ISSUEDBY', type: 'string', label: 'Issued By' },
    { key: 'ISSUEDTO', type: 'string', label: 'Issued To' },
    
    // Restrictions
    { key: 'ALLOWEDVENUES', type: 'string', label: 'Allowed Venues' },
    { key: 'EXCLUDEDVENUES', type: 'string', label: 'Excluded Venues' },
    { key: 'ALLOWEDPRODUCTS', type: 'string', label: 'Allowed Products' },
    { key: 'EXCLUDEDPRODUCTS', type: 'string', label: 'Excluded Products' },
    { key: 'ALLOWEDDEPARTMENTS', type: 'string', label: 'Allowed Departments' },
    { key: 'EXCLUDEDDEPARTMENTS', type: 'string', label: 'Excluded Departments' },
    
    // Settings
    { key: 'DISCOUNTTYPE', type: 'string', label: 'Discount Type' },
    { key: 'DISCOUNTVALUE', type: 'number', label: 'Discount Value' },
    { key: 'TRANSFERABLE', type: 'boolean', label: 'Transferable' },
    { key: 'REDEEMABLE', type: 'boolean', label: 'Redeemable' },
    { key: 'COMBINABLE', type: 'boolean', label: 'Combinable' },
    
    // Custom Fields
    ...Array.from({ length: 5 }, (_, i) => ({
      key: `CUSTOMFLAG${i + 1}`,
      type: 'boolean',
      label: `Custom Flag ${i + 1}`
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      key: `CUSTOMNUM${i + 1}`,
      type: 'number',
      label: `Custom Number ${i + 1}`
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
      key: `CUSTOMDATE${i + 1}`,
      type: 'date',
      label: `Custom Date ${i + 1}`
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      key: `CUSTOMTEXT${i + 1}`,
      type: 'string',
      label: `Custom Text ${i + 1}`
    }))
  ]
};

export async function POST(req: Request) {
  try {
    const { config } = await req.json();

    // Create a new Flatfile space using their REST API
    const response = await fetch('https://platform.flatfile.com/api/v1/spaces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer pk_XEAOS2NvMzO8zgMdTOqNKCv3c8EHx3XT`,
      },
      body: JSON.stringify({
        name: config.name,
        labels: ['voucher-import'],
        sheets: [{
          name: 'Vouchers',
          slug: 'vouchers',
          ...voucherFields,
          actions: [{
            operation: 'submitAction',
            mode: 'background',
            label: 'Submit',
            description: 'Submit data for processing',
            primary: true,
            url: 'http://localhost:3000/api/flatfile/webhook'
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create space: ${response.statusText}`);
    }

    const space = await response.json();

    // Return the space URL and ID
    return NextResponse.json({ 
      spaceUrl: `https://platform.flatfile.com/spaces/${space.data.id}`,
      spaceId: space.data.id 
    });
  } catch (error) {
    console.error('Error creating Flatfile space:', error);
    return NextResponse.json(
      { error: 'Failed to create Flatfile space' },
      { status: 500 }
    );
  }
} 