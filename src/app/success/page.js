'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "../components/menu/AppContext";
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const getEstimatedTimes = (createdAt, isDelivery) => {
    const minMinutes = isDelivery ? 30 : 20;
    const maxMinutes = isDelivery ? 45 : 30;
    
    const minTime = new Date(createdAt);
    const maxTime = new Date(createdAt);
    
    minTime.setMinutes(minTime.getMinutes() + minMinutes);
    maxTime.setMinutes(maxTime.getMinutes() + maxMinutes);
    
    return {
        minTime: formatTime(minTime),
        maxTime: formatTime(maxTime)
    };
};

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { clearCart } = useCart();
    const { data: session } = useSession();
    const [orderDetails, setOrderDetails] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasProcessed, setHasProcessed] = useState(false);
    const processedRef = useRef(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentIntentId = queryParams.get('payment_intent');

        if (paymentIntentId && !processedRef.current) {
            processedRef.current = true;
            setIsProcessing(true);
            
            fetch('/api/order/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentIntentId }),
            })
            .then(res => res.json())
            .then(data => {
                console.log('Order details received:', data);
                setOrderDetails(data);
                clearCart();
            })
            .catch(err => console.error('Error fetching order details:', err))
            .finally(() => setIsProcessing(false));
        }
        localStorage.removeItem('guestEmail');
    }, []);

    if (!orderDetails) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Processing your order...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500">Thank you for your order.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="text-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold mb-2">Order Details</h2>
                    <p className="text-gray-600 mb-2">Order Number: #{orderDetails.orderNumber}</p>
                    
                    {/* Order Items Section */}
                    <div className="mt-4 space-y-2">
                        {orderDetails.items.map((item, index) => (
                            <div key={index} className="text-gray-600">
                                <p className="font-medium">{item.title}</p>
                                {item.addOns && item.addOns.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    {/* Estimated Time Section */}
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-gray-600">
                            Estimated {orderDetails.deliveryOption === 'delivery' ? 'Delivery' : 'Collection'} Time:{' '}
                            {(() => {
                                const { minTime, maxTime } = getEstimatedTimes(
                                    orderDetails.createdAt,
                                    orderDetails.deliveryOption === 'delivery'
                                );
                                return `${minTime} - ${maxTime}`;
                            })()}
                        </p>
                    </div>
                </div>

                {/* Collection/Delivery Details Section */}
                <div className="text-center">
                    {orderDetails.deliveryOption === 'delivery' ? (
                        <div>
                            <h3 className="text-xl font-medium">Delivery Address</h3>
                            <p className="text-gray-600 mb-4">Your order will be delivered to:</p>
                            <p className="text-xl mb-2 font-medium">{orderDetails.address.street}</p>
                            <p className="text-gray-600">{orderDetails.address.city}</p>
                            <p className="text-gray-600">{orderDetails.address.postalCode}</p>
                            {orderDetails.address.instructions && (
                                <p className="text-gray-600 mt-4">
                                    <span className="text-xl font-medium">Instructions: </span>
                                    {orderDetails.address.instructions}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-medium">Self Collection</h3>
                            <p className="text-gray-600 mb-4">Please collect your order from:</p>
                            <p className="text-xl mb-2 font-medium">Pasta Express</p>
                            <p className="text-gray-600">Nanyang Technological University North Spine</p>
                            <p className="text-gray-600">Singapore 639798</p>
                        </div>
                    )}
                </div>

                {session?.user?.email && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                        A confirmation email has been sent to {session.user.email}
                    </p>
                )}
            </div>

            <button 
                onClick={() => router.push('/')}
                className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
            >
                Back to Home
            </button>
        </div>
    );
} 