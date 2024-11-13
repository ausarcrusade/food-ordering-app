import { getSession } from "@/lib/auth";
import Stripe from 'stripe';
import { connectToDatabase } from "@/lib/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getSession();
    const { amount, deliveryOption, items, address } = await req.json();

    // Ensure addOns are included in the items
    const simplifiedItems = items.map(item => ({
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      addOns: Array.isArray(item.addOns) ? item.addOns : []
    }));

    console.log('Sending to Stripe:', JSON.stringify(simplifiedItems, null, 2));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'sgd',
      metadata: {
        email: session?.user?.email || 'guest@example.com',
        deliveryOption,
        orderItems: JSON.stringify(simplifiedItems),
        ...(address ? { address: JSON.stringify(address) } : {})
      }
    });

    return Response.json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return Response.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 