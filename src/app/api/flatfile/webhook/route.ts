import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const event = await req.json();

    // Verify the webhook signature (you should implement this)
    // const signature = req.headers.get('x-flatfile-signature');
    // if (!verifySignature(signature, JSON.stringify(event))) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // Handle different event types
    switch (event.type) {
      case 'workbook.submitted':
        // Handle the submitted data
        const { workbookId, spaceId } = event.data;
        
        // Fetch the submitted data from Flatfile
        const response = await fetch(
          `https://platform.flatfile.com/api/v1/workbooks/${workbookId}/records`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.FLATFILE_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch workbook data');
        }

        const data = await response.json();
        
        // Process the data (you can implement your own logic here)
        console.log('Received data:', data);

        // Return success
        return NextResponse.json({ success: true });

      default:
        // Ignore other event types
        return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 