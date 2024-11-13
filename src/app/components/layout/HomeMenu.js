import Image from "next/image";
import SectionHeaders from "./sectionheaders";
import MenuItem from "../menu/MenuItem";

export default function HomeMenu() {
    // Example menu items data - you should replace this with your actual data
    const menuItems = [
        {
            _id: '1',
            title: 'Carbonara',
            description: 'Cream Sauce + Spaghetti, Pork Bacon, Sous Vide Egg, Spinach, Button Mushroom',
            price: 11.80,
            image: '/Carbonara.jpg'
        },
        {
            _id: '2',
            title: 'Bolognese',
            description: 'Tomato Sauce + Spaghetti, Minced Beef, Sous Vide Egg, Spinach, Button Mushroom',
            price: 11.80,
            image: '/Bolognese.jpg'
        },
        {
            _id: '3',
            title: 'Chicken Alfredo',
            description: 'Cream Sauce + Spaghetti, Chicken Thigh, Sous Vide Egg, Spinach, Button Mushroom',
            price: 11.80,
            image: '/Chicken Alfredo.jpg'
        },

        {
            _id: '4',
            title: 'Duck Aglio Olio',
            description: 'Aglio Olio + Spaghetti, Smoked Duck, Sous Vide Egg, Spinach, Button Mushroom',
            price: 11.80,
            image: '/Duck Aglio Olio.jpg'
        },

        {
            _id: '5',
            title: 'Vegetable Delight',
            description: 'Tomato Sauce + Spaghetti, Sous Vide Egg, Spinach, Button Mushroom, Capsicum, Black Olive',
            price: 12.80,
            image: '/Vegetable Delight.jpg'
        },

        {
            _id: '6',
            title: 'Meat Lovers',
            description: 'Cream Sauce + Spaghetti, Smoked Duck, Pork Bacon, Chicken Thigh, Sous Vide Egg',
            price: 12.60,
            image: '/Meat Lovers.jpg'
        },

        // Add more menu items as needed
    ];

    return (
        <section>
            <SectionHeaders 
                subHeader="Our Menu"
                mainHeader="Popular Pasta"
            />

            <div className="grid grid-cols-3 gap-4 my-10">
                {menuItems.map(item => (
                    <MenuItem 
                        key={item._id}
                        _id={item._id}
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                    />
                ))}
            </div>
        </section>
    );
}