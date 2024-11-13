'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setError(error.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Redirect to success page with payment intent ID
                router.push(`/success?payment_intent=${paymentIntent.id}`);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error('Payment error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    {error}
                </div>
            )}
            
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}
