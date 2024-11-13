'use client';
import Image from "next/image";
import { useCart } from "../menu/AppContext";
import { useState } from "react";

export default function MenuItem({ _id, title, description, price, image }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({ _id, title, description, price, image }, quantity);
        setQuantity(1); // Reset quantity after adding to cart
    };

    return (
        <div className="bg-gray-100 hover:bg-white p-4 rounded-md shadow-md text-center flex flex-col h-[500px] w-full">
            <div className="relative w-full h-48 mb-4">
                <Image 
                    src={image || "/meatballs.png"} 
                    alt={title} 
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
            <div className="flex-1 flex flex-col">
                <h4 className="text-2xl font-semibold my-1 line-clamp-1">
                    {title}
                </h4>
                <p className="text-gray-500 mb-2 flex-1 line-clamp-3">
                    {description}
                </p>
                <p className="text-2xl font-bold text-primary mb-4">
                    ${price.toFixed(2)}
                </p>
                <div className="mt-auto">
                    <div className="flex items-center gap-2 justify-center">
                        <button 
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="bg-gray-200 px-2 py-1 rounded-md">
                            -
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(prev => prev + 1)}
                            className="bg-gray-200 px-2 py-1 rounded-md">
                            +
                        </button>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="mt-4 bg-primary text-white px-8 py-2 rounded-md font-bold w-full">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}