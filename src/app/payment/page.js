'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "../components/menu/AppContext";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/payment/PaymentForm';
import Image from 'next/image';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const router = useRouter();
    const { cartProducts, clearCart } = useCart();
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);

    const subtotal = cartProducts.reduce((acc, item) => 
        acc + (item.price * item.quantity), 0
    );

    useEffect(() => {
        const deliveryAddress = localStorage.getItem('deliveryAddress');
        
        // Create PaymentIntent as soon as the page loads
        fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: subtotal,
                items: cartProducts,
                deliveryOption: deliveryAddress ? 'delivery' : 'pickup',
                address: deliveryAddress ? JSON.parse(deliveryAddress) : null
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                setError(data.error);
                return;
            }
            setClientSecret(data.clientSecret);
            // Clear delivery address from localStorage
            localStorage.removeItem('deliveryAddress');
        })
        .catch((err) => {
            setError('Failed to initialize payment');
        });
    }, [subtotal, cartProducts]);

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>
            
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                    {cartProducts.map(item => (
                        <div key={item._id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16">
                                <Image
                                    src={item.image || "/meatballs.png"}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                </p>
                            </div>
                            <p className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Stripe Payment Form */}
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm />
                </Elements>
            )}

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            <button 
                onClick={() => router.push('/cart')}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-md font-bold hover:bg-gray-200 transition-colors"
            >
                Back to Cart
            </button>
        </div>
    );
}
