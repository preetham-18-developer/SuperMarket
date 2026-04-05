import twilio from 'twilio';

/**
 * Standardized WhatsApp notification service
 * Uses Twilio WhatsApp API.
 */
export async function sendWhatsAppNotification(orderData: {
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886'
  const adminNumber = '917893287376';
  
  if (!accountSid || !authToken || !twilioNumber) {
    console.warn('Twilio credentials missing. Logging notification to console instead.');
    return logMockNotification(orderData, adminNumber);
  }

  const client = twilio(accountSid, authToken);
  
  const itemsText = orderData.items
    .map(i => `- ${i.name} (x${i.quantity})`)
    .join('\n');

  const message = `*NEW ORDER RECEIVED - Supermarket Hub*
  
*ID:* ${orderData.orderNumber}
*Customer:* ${orderData.customerName}
*Total:* ₹${orderData.total}

*Order Breakdown:*
${itemsText}

_A digital invoice has been prepared. View it here: [Invoice Link]_`;

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: `whatsapp:+${adminNumber}`
    });
    
    console.log('[Twilio] Notification sent:', response.sid);
    return { success: true, sid: response.sid };
  } catch (err) {
    console.error('[Twilio] WhatsApp failed:', err);
    throw err;
  }
}

function logMockNotification(orderData: any, adminNumber: string) {
  console.log('--- ADMIN NOTIFICATION (MOCK) ---');
  console.log(`To: ${adminNumber}`);
  console.log(`Order: ${orderData.orderNumber}`);
  return { success: true, message: 'Logged to console' };
}
