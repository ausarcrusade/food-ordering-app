'use client';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
    const router = useRouter();

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Payment</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-4">Payment integration will be implemented here.</p>
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
