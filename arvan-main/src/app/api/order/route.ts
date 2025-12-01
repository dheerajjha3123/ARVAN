import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
 try {
  const { amount, currency } = (await request.json()) as {
   amount: string;
   currency: string;
  };

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
   return NextResponse.json({ error: 'Payment configuration missing' }, { status: 500 });
  }

  const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
   amount: amount,
   currency: currency,
   receipt: 'rcp1',
  };
  const order = await razorpay.orders.create(options);
  return NextResponse.json({ orderId: order.id }, { status: 200 });
 } catch (error) {
  console.error('Razorpay order creation failed:', error);
  return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
 }
}
