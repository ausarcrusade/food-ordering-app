'use client';
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({});

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
}

function CartProvider({ children }) {
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        const localCart = localStorage.getItem('cart');
        if (localCart) {
            setCartProducts(JSON.parse(localCart));
        }
    }, []);

    function addToCart(product, quantity = 1) {
        setCartProducts(prevCart => {
            const existingProductIndex = prevCart.findIndex(
                item => item._id === product._id
            );

            let newCart;
            if (existingProductIndex !== -1) {
                newCart = [...prevCart];
                newCart[existingProductIndex] = {
                    ...newCart[existingProductIndex],
                    quantity: newCart[existingProductIndex].quantity + quantity
                };
            } else {
                newCart = [...prevCart, { ...product, quantity }];
            }

            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    }

    function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;
        
        setCartProducts(prevCart => {
            const newCart = prevCart.map(item => 
                item._id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    }

    function removeFromCart(productId) {
        setCartProducts(prevCart => {
            const newCart = prevCart.filter(item => item._id !== productId);
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    }

    return (
        <CartContext.Provider value={{ 
            cartProducts, 
            addToCart, 
            updateQuantity, 
            removeFromCart 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function AppProvider({ children }) {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>
    );
}
