'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";

export default function AddOnModal({ 
    isOpen, 
    onClose, 
    onAddToCart, 
    item, 
    selectedAddOns, 
    onAddOnSelection,
    generatedImages,
    onImageGenerated
}) {
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [localSelectedAddOns, setLocalSelectedAddOns] = useState(selectedAddOns);
    const [totalPrice, setTotalPrice] = useState(item.price);
    const [pastaName, setPastaName] = useState(item.title);

    const addOns = [
        { id: '1', name: 'Chicken', price: 2.5, category: 'protein', icon: '🍗' },
        { id: '2', name: 'Shrimp', price: 3, category: 'protein', icon: '🦐' },
        { id: '3', name: 'Mushrooms', price: 1.5, category: 'vegetable', icon: '🍄' },
        { id: '4', name: 'Bell Peppers', price: 1, category: 'vegetable', icon: '🫑' },
        { id: '5', name: 'Parmesan Cheese', price: 1, category: 'cheese', icon: '🧀' },
        { id: '6', name: 'Mozzarella', price: 1.5, category: 'cheese', icon: '🧀' },
    ];

    const generatePastaImage = async () => {
        if (localSelectedAddOns.length === 0) return;
        
        setIsGeneratingImage(true);
        try {
            const selectedIngredients = localSelectedAddOns
                .map(id => addOns.find(a => a.id === id)?.name)
                .filter(Boolean);
            
            const prompt = `An extremely close up top down view of ${item.title} spaghetti with ${selectedIngredients.join(', ')}, 
            on a black plate in a white background, appetizing lighting, high resolution`;
            
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate image');
            }

            if (data.imageUrl) {
                onImageGenerated(item._id, data.imageUrl);
            } else {
                throw new Error('No image URL received');
            }
        } catch (error) {
            console.error('Failed to generate image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsGeneratingImage(false);
        }
    };

    useEffect(() => {
        // Calculate total price and update pasta name
        const addOnPrice = localSelectedAddOns.reduce((sum, addOnId) => {
            const addOn = addOns.find(a => a.id === addOnId);
            return sum + (addOn ? addOn.price : 0);
        }, 0);
        setTotalPrice(item.price + addOnPrice);

        const selectedIngredients = localSelectedAddOns.map(id => addOns.find(a => a.id === id)?.name).filter(Boolean);
        setPastaName(`${item.title} with ${selectedIngredients.join(', ')}`);
    }, [localSelectedAddOns, item.price, item.title]);

    useEffect(() => {
        setLocalSelectedAddOns(selectedAddOns);
    }, [selectedAddOns]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleAddOnChange = (addOnId) => {
        setLocalSelectedAddOns((prev) =>
            prev.includes(addOnId)
                ? prev.filter((id) => id !== addOnId)
                : [...prev, addOnId]
        );
    };

    const handleAddToCart = () => {
        const selectedAddOnDetails = addOns.filter((addOn) =>
            localSelectedAddOns.includes(addOn.id)
        );
        onAddToCart(item, selectedAddOnDetails);
        onAddOnSelection(localSelectedAddOns);
        onClose();
    };

    const handleClose = () => {
        onAddOnSelection(localSelectedAddOns);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-hidden"
            onClick={handleClose}
        >
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-3xl font-bold text-center text-primary mb-4">Build Your Own Pasta!</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 overflow-hidden rounded-lg shadow-md">
                                <Image 
                                    src={item.image || "/meatballs.png"} 
                                    alt={item.title} 
                                    fill
                                    className="object-cover transform hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 mt-1">{item.description}</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-gray-600 font-medium">Base Price: ${item.price.toFixed(2)}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-gray-600 font-medium">Add-ons:</p>
                                        <p className="text-primary font-medium">
                                            +${(totalPrice - item.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="pt-1 border-t border-gray-200">
                                        <p className="text-lg font-bold text-primary">
                                            Total: ${totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="p-6">
                        <h4 className="text-xl font-semibold mb-4">Choose your ingredients:</h4>
                        <div className="space-y-6">
                            {['protein', 'vegetable', 'cheese'].map(category => (
                                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-medium capitalize text-lg mb-3 text-gray-700">
                                        {category}
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        {addOns.filter(addOn => addOn.category === category).map((addOn) => (
                                            <label 
                                                key={addOn.id} 
                                                className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 
                                                    ${localSelectedAddOns.includes(addOn.id) 
                                                        ? 'bg-primary/10 border-primary' 
                                                        : 'bg-white border-gray-200'} 
                                                    border-2 hover:shadow-md`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={addOn.id}
                                                    checked={localSelectedAddOns.includes(addOn.id)}
                                                    onChange={() => handleAddOnChange(addOn.id)}
                                                    className="hidden"
                                                />
                                                <span className="text-xl mr-2">{addOn.icon}</span>
                                                <div className="flex-1 text-center">
                                                    <p className="font-medium">{addOn.name}</p>
                                                    <p className="text-sm text-gray-600">+${addOn.price.toFixed(2)}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold mb-2 text-center">Your Custom Pasta</h4>
                            <p className="text-gray-700 mb-4 text-center">{pastaName}</p>
                            
                            {/* Generated Image Section */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={generatePastaImage}
                                        disabled={isGeneratingImage || localSelectedAddOns.length === 0}
                                        className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 w-56
                                            ${isGeneratingImage || localSelectedAddOns.length === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-primary text-white hover:bg-primary/90'}`}
                                    >
                                        <span className="whitespace-nowrap">
                                            {isGeneratingImage ? 'Cooking...' : 'Visualize Your Pasta'}
                                        </span>
                                        {!isGeneratingImage && <span>🎨</span>}
                                    </button>
                                </div>
                                
                                <div className="relative aspect-square w-[60%] max-w-[360px] mx-auto rounded-lg overflow-hidden shadow-md">
                                    {isGeneratingImage ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                                <p className="mt-2 text-sm text-gray-600">Creating your pasta...</p>
                                            </div>
                                        </div>
                                    ) : generatedImages[item._id] ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <Image
                                                src={generatedImages[item._id]}
                                                alt={pastaName}
                                                width={360}
                                                height={360}
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-center p-4">
                                            <p className="text-sm text-gray-500 mb-2">No preview yet</p>
                                            <p className="text-xs text-gray-400">
                                                {localSelectedAddOns.length === 0 
                                                    ? 'Select ingredients to enable visualization'
                                                    : 'Click "Visualize Your Pasta" to see a preview'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Existing price and buttons section */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-xl font-bold">Total Price:</p>
                            <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors duration-200 w-1/2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 w-1/2"
                            >
                                <span>Add to Cart</span>
                                <span className="text-lg">🛒</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}