import { getSession } from "@/lib/auth";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { connectToDatabase } from "@/lib/mongoose";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const session = await getSession();
        const { paymentIntentId } = await req.json();

        await connectToDatabase();

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const metadata = paymentIntent.metadata;

        // Validate required data
        if (!metadata.orderItems) {
            throw new Error('No order items found in metadata');
        }

        const orderItems = JSON.parse(metadata.orderItems);
        
        // Validate order items structure
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            throw new Error('Invalid order items format');
        }

        // Find user if logged in
        let user = null;
        if (session?.user?.email) {
            user = await User.findOne({ email: session.user.email });
        }

        // Prepare order data with preserved addOns structure
        const orderData = {
            orderNumber: `ORD${Date.now()}`,
            user: user?._id,
            email: session?.user?.email || metadata.email,
            items: orderItems.map(item => ({
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image || null,
                addOns: Array.isArray(item.addOns) ? item.addOns : [] // Preserve addOns array
            })),
            total: paymentIntent.amount / 100,
            deliveryOption: metadata.deliveryOption || 'pickup',
            status: 'confirmed',
            paymentIntentId,
        };

        // Add address if delivery option is selected
        if (metadata.address) {
            orderData.address = JSON.parse(metadata.address);
        }

        // Create order in database
        const order = await Order.create(orderData);

        // Clear user's cart after successful order
        if (user) {
            await User.updateOne(
                { _id: user._id },
                { $set: { cart: [] } }
            );
        }

        return Response.json({
            success: true,
            orderNumber: order.orderNumber,
            deliveryOption: order.deliveryOption,
            address: order.address,
            total: order.total,
            items: order.items,
            createdAt: order.createdAt
        });
    } catch (error) {
        console.error('Order confirmation error details:', {
            message: error.message,
            stack: error.stack,
            validationErrors: error.errors
        });
        
        return Response.json(
            { error: 'Error confirming order', details: error.message },
            { status: 500 }
        );
    }
}