'use client';
import { useCart } from "../components/menu/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';

export default function CartPage() {
    const { cartProducts, updateQuantity, removeFromCart, clearCart } = useCart();
    const [deliveryOption, setDeliveryOption] = useState('pickup'); // 'pickup' or 'delivery'
    const deliveryFee = deliveryOption === 'delivery' ? 5.00 : 0.00;

    const subtotal = cartProducts.reduce((acc, item) => 
        acc + (item.price * item.quantity), 0
    );
    
    const total = subtotal + deliveryFee;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Your Cart</h2>
                {cartProducts.length > 0 && (
                    <button 
                        onClick={clearCart}
                        className="text-white bg-primary hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 px-4 py-2 border border-red-500 rounded-md w-36"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" 
                            />
                        </svg>
                        Clear Cart
                    </button>
                )}
            </div>

            {cartProducts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-2xl text-gray-500 mb-8">Your cart is empty</div>
                    <Link 
                        href="/" 
                        className="bg-primary font-semibold text-xl text-white px-12 py-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartProducts.map(item => (
                            <div key={item._id} 
                                className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                            >
                                {/* Image Container */}
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <Image 
                                        src={item.image || "/meatballs.png"} 
                                        alt={item.title} 
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                                {/* Content Container */}
                                <div className="flex flex-col flex-grow gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="max-w-[200px]">
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                            {item.addOns && item.addOns.length > 0 && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-white bg-primary hover:bg-primary/90 transition-colors text-sm w-24"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    {/* Price and Quantity Controls */}
                                    <div className="flex justify-between items-end mt-auto">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-md transition-colors flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-md transition-colors flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Price per item: ${item.price.toFixed(2)}</p>
                                            <p className="font-bold text-lg text-primary">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 sticky top-4">
                            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                            
                            {/* Delivery Options */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Select Delivery Option</h4>
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200
                                        ${deliveryOption === 'pickup' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:border-primary/30'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="pickup"
                                            checked={deliveryOption === 'pickup'}
                                            onChange={(e) => setDeliveryOption(e.target.value)}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <div className="font-medium">Self Pickup</div>
                                            <div className="text-sm text-gray-500">20-30 mins</div>
                                        </div>
                                        <div className="ml-auto font-semibold text-green-600">Free</div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-all duration-200
                                        ${deliveryOption === 'delivery' 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-gray-200 hover:border-primary/30'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="delivery"
                                            checked={deliveryOption === 'delivery'}
                                            onChange={(e) => setDeliveryOption(e.target.value)}
                                            className="text-primary focus:ring-primary"
                                        />
                                        <div>
                                            <div className="font-medium">Delivery</div>
                                            <div className="text-sm text-gray-500">30-45 mins</div>
                                        </div>
                                        <div className="ml-auto font-semibold">$5.00</div>
                                    </label>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary text-xl">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
