'use client';
import Image from "next/image";
import { useState } from "react";
import AddOnModal from "../menu/AddOnModal";
import SectionHeaders from "./sectionheaders";

export default function HomeMenuWithAddOns() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddOns, setSelectedAddOns] = useState({});
    const [generatedImages, setGeneratedImages] = useState({});

    const menuItems = [
        {
            _id: '1',
            title: 'Creamy Base',
            description: 'Rich, velvety, and indulgent – luxurious sauce that wraps every bite in smoothness',
            price: 2.99,
            image: '/cream-base.jpg'
        },
        {
            _id: '2',
            title: 'Tomato Base ',
            description: 'Bold, vibrant, and zesty – classic burst of fresh, sun-ripened tomato goodness',
            price: 2.99,
            image: '/tomato-base.jpg'
        },
        {
            _id: '3',
            title: 'Aglio Olio Base',
            description: 'Light, garlicky, and aromatic – savory blend that celebrates the essence of Italian cuisine',
            price: 2.99,
            image: '/oil-base.jpg'
        }
    ];

    const handleAddToCartClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddToCart = (item, addOns) => {
        console.log('Adding to cart:', item, 'with add-ons:', addOns);
        setIsModalOpen(false);
    };

    const handleAddOnSelection = (itemId, addOns) => {
        setSelectedAddOns(prev => ({
            ...prev,
            [itemId]: addOns
        }));
    };

    const handleImageGenerated = (itemId, imageUrl) => {
        setGeneratedImages(prev => ({
            ...prev,
            [itemId]: imageUrl
        }));
    };

    return (
        <section>
            <SectionHeaders 
                subHeader="Build Your Own Pasta!"
                mainHeader="Pasta Bases"
            />
            <div className="grid grid-cols-3 gap-4 my-10">
                {menuItems.map(item => (
                    <div key={item._id} className="bg-gray-100 hover:bg-white p-4 rounded-md shadow-md text-center flex flex-col items-center">
                        <Image 
                            src={item.image || "/meatballs.png"} 
                            alt={item.title} 
                            width={300} 
                            height={300} 
                            className="object-cover"
                        />
                        <h4 className="text-2xl font-semibold my-1">
                            {item.title}
                        </h4>
                        <p className="text-gray-500 mb-2">
                            {item.description}
                        </p>
                        <p className="text-2xl font-bold text-primary mb-4">
                            From ${item.price.toFixed(2)}
                        </p>
                        <button 
                            onClick={() => handleAddToCartClick(item)}
                            className="mt-4 bg-primary text-white px-8 py-2 rounded-md font-bold hover:bg-primary/90 transition-colors">
                            Customize
                        </button>
                    </div>
                ))}
            </div>
            {selectedItem && (
                <AddOnModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddToCart={(addOns) => handleAddToCart(selectedItem, addOns)}
                    item={selectedItem}
                    selectedAddOns={selectedAddOns[selectedItem._id] || []}
                    onAddOnSelection={(addOns) => handleAddOnSelection(selectedItem._id, addOns)}
                    generatedImages={generatedImages}
                    onImageGenerated={handleImageGenerated}
                />
            )}
        </section>
    );
}
