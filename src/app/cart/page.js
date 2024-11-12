'use client';
import { useCart } from "../components/menu/AppContext";

export default function CartPage() {
    const { cartProducts, updateQuantity, removeFromCart } = useCart();

    const total = cartProducts.reduce((acc, item) => 
        acc + (item.price * item.quantity), 0
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
            {cartProducts.length === 0 ? (
                <div>Your cart is empty</div>
            ) : (
                <>
                    {cartProducts.map(item => (
                        <div key={item._id} className="flex items-center gap-4 mb-4 p-4 bg-gray-100 rounded-md">
                            <img src={item.image} alt={item.title} className="w-24 h-24 object-cover"/>
                            <div className="flex-grow">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p>${item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="bg-gray-200 px-2 py-1 rounded-md">
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="bg-gray-200 px-2 py-1 rounded-md">
                                        +
                                    </button>
                                </div>
                                <p className="mt-1 text-gray-600">
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="text-right mt-4">
                        <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
                        <button className="bg-primary text-white px-8 py-2 rounded-md mt-4">
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
