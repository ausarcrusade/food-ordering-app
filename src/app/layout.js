import { Roboto, Roboto_Mono } from 'next/font/google';
import "./globals.css";
import Header from './components/layout/header';
import { AppProvider } from './components/menu/AppContext';


const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto-mono',
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <AppProvider>
          <Header />
          <main className="max-w-4xl mx-auto p-4 pt-6">
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-10">
              &copy; 2024 All Rights Reserved.
            </footer>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
