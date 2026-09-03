export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, subject, message } = data;

    if (!firstName || !email || !message) {
      return Response.json(
        { error: 'First name, email, and message are required.' },
        { status: 400 }
      );
    }

    console.log('=== NEW CONTACT INQUIRY RECEIVED ===');
    console.log({
      receivedAt: new Date().toISOString(),
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      phone: phone || 'N/A',
      subject: subject || 'General',
      message,
    });

    return Response.json({
      success: true,
      message: 'Your message has been sent successfully! The Lucky Gaming Xone team will get back to you shortly.',
      receivedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      { error: 'Failed to process inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
