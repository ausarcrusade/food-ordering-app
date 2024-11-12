'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../menu/AppContext";

export default function Header() {
  const { data: session, status } = useSession();
  const { cartProducts } = useCart();
  
  return (
    <header className="flex items-center justify-between">
      <Link className="text-primary font-semibold text-2xl" href="/">
        Pasta Express
      </Link>
      
      <nav className="flex gap-6 items-center text-gray-500 font-semibold">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>    
      
      <nav className="flex gap-4 items-center text-gray-500 font-semibold">
        <Link href="/cart" className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               strokeWidth={1.5} 
               stroke="currentColor" 
               className="w-6 h-6">
            <path strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          {cartProducts?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs py-1 px-2 rounded-full">
              {cartProducts.length}
            </span>
          )}
        </Link>
        
        {status === 'unauthenticated' && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register" className="bg-primary text-white px-8 py-2 rounded-md">
              Register
            </Link>
          </>
        )}
        {status === 'authenticated' && (
          <>
            <Link href="/profile">Profile</Link>
            <button onClick={() => signOut()} className="bg-primary text-white px-8 py-2 rounded-md">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
 