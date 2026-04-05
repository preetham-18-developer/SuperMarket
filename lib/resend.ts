import { Resend } from 'resend';

// Initialize Resend with API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

/**
 * Sends a premium order confirmation email using Resend.
 * @param orderData - Full details of the order
 */
export async function sendOrderConfirmation(orderData: {
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  total: number,
  items: any[]
}) {
  try {
    const data = await resend.emails.send({
      from: 'Supermarket <onboarding@resend.dev>',
      to: orderData.customerEmail,
      subject: `Order Confirmed: ${orderData.orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1c1410;">
          <div style="background: #ff6b00; padding: 40px; text-align: center; border-radius: 20px 20px 0 0;">
             <h1 style="color: white; margin: 0; font-size: 28px;">Supermarket</h1>
             <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Your premium groceries are on the way!</p>
          </div>
          
          <div style="padding: 40px; background: #fff8f0; border: 1px solid rgba(0,0,0,0.05);">
             <h2 style="margin-top: 0;">Hi ${orderData.customerName.split(' ')[0]},</h2>
             <p>Thanks for shopping with Supermarket. We've received your order and are currently picking the freshest items for you.</p>
             
             <div style="background: white; padding: 25px; border-radius: 15px; margin: 30px 0; border: 1px solid rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                   <span style="font-weight: bold;">Order Number:</span>
                   <span>${orderData.orderNumber}</span>
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                   <thead>
                      <tr style="text-align: left; font-size: 12px; color: #888;">
                         <th style="padding-bottom: 10px;">ITEM</th>
                         <th style="text-align: right; padding-bottom: 10px;">PRICE</th>
                      </tr>
                   </thead>
                   <tbody>
                      ${orderData.items.map(item => `
                        <tr>
                           <td style="padding: 10px 0; font-size: 14px;">${item.name} x ${item.quantity}</td>
                           <td style="text-align: right; padding: 10px 0; font-size: 14px;">₹${item.price * item.quantity}</td>
                        </tr>
                      `).join('')}
                   </tbody>
                </table>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #ff6b00; display: flex; justify-content: space-between; align-items: center;">
                   <span style="font-weight: 800; font-size: 18px;">Total Amount</span>
                   <span style="font-weight: 800; font-size: 18px; color: #ff6b00;">₹${orderData.total}</span>
                </div>
             </div>
             
             <p style="font-size: 14px; color: #666;">Need help? Reply to this email or visit our help center.</p>
          </div>
          
          <div style="padding: 30px; text-align: center; color: #888; font-size: 12px;">
             <p>© 2026 Supermarket Group Pvt. Ltd. <br/> Nellore, Andhra Pradesh</p>
          </div>
        </div>
      `
    });

    return { success: true, data };
  } catch (error) {
    console.error('Resend Error:', error);
    return { success: false, error };
  }
}
