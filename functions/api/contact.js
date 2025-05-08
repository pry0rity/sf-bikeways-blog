export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const email = formData.get('email');
    const message = formData.get('message');

    const resendApiKey = context.env.RESEND_API_KEY; // Store your API key in Cloudflare environment variables!

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Or a domain you have verified with Resend
        to: ['me@willmcmullen.com'],
        subject: 'New Contact Form Submission - SF Bikeways',
        html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process form' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 