import { getServerSession } from "next-auth";
import Stripe from 'stripe';
import { connectToDatabase } from "@/lib/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { amount, deliveryOption, items } = await req.json();

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'sgd',
      metadata: {
        email: session.user.email,
        deliveryOption,
        orderItems: JSON.stringify(items)
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