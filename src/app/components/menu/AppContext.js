'use client';
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext({});

function CartProvider({ children }) {
    const [cartProducts, setCartProducts] = useState([]);
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [previousStatus, setPreviousStatus] = useState(status);

    // Initial load of cart
    useEffect(() => {
        async function loadInitialCart() {
            if (status === 'loading') return;

            if (status === 'authenticated') {
                // Load cart from database
                const response = await fetch('/api/cart');
                if (response.ok) {
                    const dbCart = await response.json();
                    setCartProducts(dbCart);
                }
            } else {
                // Load cart from localStorage
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                setCartProducts(localCart);
            }
            setIsLoading(false);
        }

        loadInitialCart();
    }, [status]);

    // Handle session status changes
    useEffect(() => {
        if (previousStatus !== status) {
            setPreviousStatus(status);
            handleSessionChange();
        }
    }, [status, previousStatus]);

    async function handleSessionChange() {
        setIsLoading(true);
        try {
            if (status === 'authenticated') {
                // User just logged in - merge local cart with database cart
                const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const response = await fetch('/api/cart');
                if (response.ok) {
                    const dbCart = await response.json();
                    const mergedCart = mergeLocalAndDbCarts(localCart, dbCart);
                    
                    // Save merged cart to database
                    await fetch('/api/cart', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cart: mergedCart }),
                    });

                    localStorage.removeItem('cart'); // Clear local cart
                    setCartProducts(mergedCart);
                }
            } else if (status === 'unauthenticated' && previousStatus === 'authenticated') {
                // User just logged out - save current cart to localStorage
                const currentCart = [...cartProducts];
                localStorage.setItem('cart', JSON.stringify(currentCart));
                setCartProducts(currentCart);
            }
        } catch (error) {
            console.error('Error handling session change:', error);
        }
        setIsLoading(false);
    }

    // Function to merge local and database carts
    function mergeLocalAndDbCarts(localCart, dbCart) {
        const mergedCart = [...dbCart];
        
        localCart.forEach(localItem => {
            const existingItemIndex = mergedCart.findIndex(
                dbItem => dbItem._id === localItem._id
            );

            if (existingItemIndex !== -1) {
                // Replace item from local cart with database cart item
                mergedCart[existingItemIndex] = { ...localItem };
            } else {
                // Item only exists in local cart - add it
                mergedCart.push({ ...localItem });
            }
        });

        return mergedCart;
    }

    // Function to save cart based on authentication status
    async function saveCart(newCart) {
        try {
            setCartProducts(newCart); // Update state first

            if (status === 'authenticated') {
                // Save to database if logged in
                await fetch('/api/cart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart: newCart }),
                });
            } else {
                // Save to localStorage if not logged in
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Cart operations
    function addToCart(product, quantity = 1) {
        const newCart = [...cartProducts];
        const existingProductIndex = newCart.findIndex(
            item => item._id === product._id
        );

        if (existingProductIndex !== -1) {
            // Update quantity if product exists
            newCart[existingProductIndex] = {
                ...newCart[existingProductIndex],
                quantity: (newCart[existingProductIndex].quantity || 0) + quantity
            };
        } else {
            // Add new product with quantity
            newCart.push({ ...product, quantity });
        }

        saveCart(newCart);
    }

    function updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;
        
        const newCart = cartProducts.map(item => 
            item._id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        );

        saveCart(newCart);
    }

    function removeFromCart(productId) {
        const newCart = cartProducts.filter(item => item._id !== productId);
        saveCart(newCart);
    }

    function clearCart() {
        saveCart([]);
    }

    if (isLoading) {
        return <div>Loading cart...</div>;
    }

    return (
        <CartContext.Provider value={{ 
            cartProducts, 
            addToCart, 
            updateQuantity, 
            removeFromCart,
            clearCart,
            isLoading 
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

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
}



// Detects when a user logs in by monitoring the session status
// Loads the cart from the appropriate source (localStorage or database)
// Merges carts when a user logs in by:
// Loading both local and database carts
// Combining items and summing quantities for duplicate items
// Saving the merged cart to the database
// Clearing localStorage
// Handles cart operations (add/update/remove) differently based on login status:
// Saves to localStorage when logged out
// Saves to database when logged in
// Provides loading states to prevent UI flashing
// Maintains cart consistency across sessions
// The merging logic ensures that:
// No items are lost during login
// Quantities are properly combined
// The cart persists across devices when logged in
// The local cart is cleared after successful merge
// The user experience remains smooth during the transition