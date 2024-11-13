'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeliveryAddressPage() {
    const router = useRouter();
    const [address, setAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        instructions: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save address to localStorage for payment page
        localStorage.setItem('deliveryAddress', JSON.stringify(address));
        router.push('/payment');
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Delivery Address</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-2">Street Address</label>
                    <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({...address, street: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Postal Code</label>
                    <input
                        type="text"
                        required
                        value={address.postalCode}
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                    <textarea
                        value={address.instructions}
                        onChange={(e) => setAddress({...address, instructions: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
                >
                    Continue to Payment
                </button>
            </form>
        </div>
    );
}
