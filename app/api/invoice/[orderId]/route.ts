import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ORDERS } from '@/lib/data';

/**
 * Endpoint to serve a generated PDF invoice.
 * Used by Twilio/WhatsApp as a Media URL.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  
  // Find order in mock data (or replace with DB call)
  const order = ORDERS.find(o => o.id.includes(orderId.replace('SM-', ''))) || ORDERS[0];

  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0);
    doc.text('SUPERMARKET HUB', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Invoice ID: ${orderId}`, 20, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 36);
    
    doc.setTextColor(40, 40, 40);
    doc.text(`Customer: ${order.customerName}`, 20, 50);
    doc.text(`Address: ${order.shippingAddress.line1}, ${order.shippingAddress.city}`, 20, 56);

    // Items Table (Mocking values if incomplete)
    const items = order.items.map(i => [i.product_name, `x${i.quantity}`, `₹${i.price || 0}`]);
    (doc as any).autoTable({
      startY: 70,
      head: [['Product', 'Qty', 'Price']],
      body: items,
      theme: 'grid',
      headStyles: { fillStyle: 'F', fillColor: [255, 107, 0] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Paid: ₹${order.totalAmount}`, 150, finalY);

    // Convert to buffer-like string
    const pdfBase64 = doc.output('datauristring');
    const pdfData = pdfBase64.split(',')[1];
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Invoice_${orderId}.pdf"`
      }
    });

  } catch (error) {
    console.error('Invoice generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
