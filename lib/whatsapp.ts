import twilio from 'twilio';

const ADMIN_PHONE = '7893287376';       // Your WhatsApp number (without country code)
const ADMIN_COUNTRY_CODE = '91';        // India

/**
 * Sends a WhatsApp order notification to the admin via Twilio.
 * Falls back to a direct wa.me link if Twilio is not configured.
 */
export async function sendWhatsAppNotification(orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER; // 'whatsapp:+14155238886'
  const adminTo = `whatsapp:+${ADMIN_COUNTRY_CODE}${ADMIN_PHONE}`;

  const itemsText = orderData.items
    .map(i => `  • ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`)
    .join('\n');

  const message =
`🛒 *NEW ORDER - SuperMarket Hub*

📋 *Order ID:* ${orderData.orderNumber}
👤 *Customer:* ${orderData.customerName}
📧 *Email:* ${orderData.customerEmail || 'N/A'}

🧾 *Items:*
${itemsText}

💰 *Total Paid:* ₹${orderData.total}
🚚 *Status:* Confirmed - Preparing for Delivery

_Please process this order as soon as possible._`;

  // ── Try Twilio first ───────────────────────────────────────────────────────
  if (accountSid && authToken && twilioFrom) {
    try {
      const client = twilio(accountSid, authToken);
      const response = await client.messages.create({
        body: message,
        from: twilioFrom,
        to: adminTo,
      });
      console.log('[Twilio] WhatsApp sent successfully. SID:', response.sid);
      return { success: true, method: 'twilio', sid: response.sid };
    } catch (err: any) {
      // Twilio error 63003 = number hasn't opted into sandbox
      // Twilio error 63007 = number not found on WhatsApp
      console.error('[Twilio] WhatsApp FAILED. Error code:', err?.code, '| Message:', err?.message);
      console.error('[Twilio] ⚠️  If error code is 63003, you must JOIN the Twilio sandbox first!');
      console.error('[Twilio] Send "join <your-sandbox-keyword>" to +14155238886 on WhatsApp.');
      // Fall through to log below
    }
  } else {
    console.warn('[WhatsApp] Twilio credentials not configured. Check environment variables.');
  }

  // ── Always log to console as backup ───────────────────────────────────────
  console.log('=== ADMIN ORDER ALERT (CONSOLE FALLBACK) ===');
  console.log(`Admin Number: +${ADMIN_COUNTRY_CODE}${ADMIN_PHONE}`);
  console.log(message);
  console.log('============================================');

  return { success: false, method: 'console', message: 'Logged to console' };
}
