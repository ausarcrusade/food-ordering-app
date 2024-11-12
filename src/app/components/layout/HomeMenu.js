import Image from "next/image";
import SectionHeaders from "./sectionheaders";
import MenuItem from "../menu/MenuItem";

export default function HomeMenu() {
    // Example menu items data - you should replace this with your actual data
    const menuItems = [
        {
            _id: '1',
            title: 'Spaghetti Meatballs',
            description: 'Classic Italian meatballs with tomato sauce',
            price: 15.99,
            image: '/meatballs.png'
        },
        {
            _id: '2',
            title: 'Fettuccine Alfredo',
            description: 'Creamy pasta with parmesan cheese',
            price: 14.99,
            image: '/meatballs.png'
        },
        {
            _id: '3',
            title: 'Spaghetti Carbonara',
            description: 'Classic Italian carbonara with egg and cheese',
            price: 13.99,
            image: '/meatballs.png'
        },
        {
            _id: '4',
            title: 'Pasta Pomodoro',
            description: 'Simple pasta with tomato sauce',
            price: 12.99,
            image: '/meatballs.png'
        },

        {
            _id: '5',
            title: 'Penne Arrabbiata',
            description: 'Spicy tomato sauce with garlic and red chilies',
            price: 13.99,
            image: '/meatballs.png'
        },
        {
            _id: '6',
            title: 'Linguine alle Vongole',
            description: 'Linguine pasta with fresh clams in white wine sauce',
            price: 16.99,
            image: '/meatballs.png'
        }
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