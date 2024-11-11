import Link from "next/link";
export default function Header() {
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
      <Link href="/login">Login</Link>
      <Link href="/register" className="bg-primary text-white px-8 py-2 rounded-md">
         Register
      </Link>
      </nav>
  </header>
  );
}
 