'use client';
import Image from "next/image";
import { useState } from "react";
import AddOnModal from "../menu/AddOnModal";
import SectionHeaders from "./sectionheaders";

export default function HomeMenuWithAddOns() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddOns, setSelectedAddOns] = useState({});

    const menuItems = [
        {
            _id: '1',
            title: 'Creamy Base',
            description: 'Creamy pasta sauce with parmesan cheese',
            price: 1.99,
            image: '/meatballs.png'
        },
        {
            _id: '2',
            title: 'Tomato Base',
            description: 'Tomato pasta sauce with garlic and olive oil',
            price: 1.99,
            image: '/meatballs.png'
        },
        {
            _id: '3',
            title: 'Tomyum Cream Base',
            description: 'Tomyum flavored creamy pasta sauce',
            price: 1.99,
            image: '/meatballs.png'
        },
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

    return (
        <section>
            <SectionHeaders 
                subHeader="Build Your Own Pasta!"
                mainHeader="Pasta Bases"
            />
            <div className="grid grid-cols-3 gap-4 my-10">
                {menuItems.map(item => (
                    <div key={item._id} className="bg-gray-100 hover:bg-white p-4 rounded-md shadow-md text-center flex flex-col items-center">
                        <Image src={item.image || "/meatballs.png"} alt={item.title} width={300} height={300} />
                        <h4 className="text-2xl font-semibold my-1">
                            {item.title}
                        </h4>
                        <p className="text-gray-500">
                            {item.description}
                        </p>
                        <button 
                            onClick={() => handleAddToCartClick(item)}
                            className="mt-4 bg-primary text-white px-8 py-2 rounded-md font-bold">
                            Starting at ${item.price}
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
                />
            )}
        </section>
    );
}
