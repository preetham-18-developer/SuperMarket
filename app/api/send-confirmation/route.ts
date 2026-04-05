import { NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/resend';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    // 1. Send Email (with Resend)
    const { success, data, error } = await sendOrderConfirmation(orderData);

    // 2. Notify Admin via WhatsApp (Back-end background process)
    try {
      await sendWhatsAppNotification(orderData);
    } catch (waError) {
      console.warn('WhatsApp Notification Failed (Ignored to avoid blocking order):', waError);
    }

    if (success) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
