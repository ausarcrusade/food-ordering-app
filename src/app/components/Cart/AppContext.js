'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({});

export function CartContextProvider({ children }) {
    const [cartProducts, setCartProducts] = useState([]);
    const [session, setSession] = useState(null); // You'll need to implement user session

    useEffect(() => {
        if (!session) {
            // Load cart from localStorage when component mounts
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                setCartProducts(JSON.parse(localCart));
            }
        } else {
            // Load cart from MongoDB when user is logged in
            fetchUserCart();
        }
    }, [session]);

    async function fetchUserCart() {
        const response = await fetch('/api/cart');
        if (response.ok) {
            const data = await response.json();
            setCartProducts(data);
        }
    }

    function addToCart(menuItem) {
        setCartProducts(prevCart => {
            const newCart = [...prevCart, menuItem];
            if (!session) {
                // Save to localStorage if user is not logged in
                localStorage.setItem('cart', JSON.stringify(newCart));
            } else {
                // Save to MongoDB if user is logged in
                saveCartToDatabase(newCart);
            }
            return newCart;
        });
    }

    async function saveCartToDatabase(cart) {
        await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });
    }

    function removeFromCart(productId) {
        const newCart = cartProducts.filter(item => item._id !== productId);
        saveCart(newCart);
    }

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
} 