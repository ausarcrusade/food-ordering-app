import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="grid grid-cols-2">
        <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold">
                Welcome to <span className="text-primary">Pasta Express</span>
            </h1>
            <p className="my-8 text-gray-500 text-2xl">
                Build your own pasta to perfection.
            </p>
            <div className="flex gap-4">
                <button className="bg-primary text-white px-8 py-2 rounded-md font-bold">
                    Order Now
                </button>
                <button className="bg-white text-primary px-8 py-2 rounded-md font-bold">
                    Learn More
                </button>
            </div>
        </div>
        <div className="flex items-center justify-center py-8">
            <Image src="/meatballs.png" alt="hero" width={400} height={400} />
        </div>
    </section>
  );
}