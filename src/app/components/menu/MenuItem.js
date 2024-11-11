import Image from "next/image";
export default function MenuItem() {
    return (
        <div className="bg-gray-100 hover:bg-white p-4 rounded-md shadow-md text-center flex flex-col items-center">
            <Image src="/meatballs.png" alt="pasta" width={300} height={300} />
            <h4 className="text-2xl font-semibold my-1">
                Meatball Pasta
            </h4>
            <p className="text-gray-500">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <button className="mt-4 bg-primary text-white px-8 py-2 rounded-md font-bold">
                Add to Cart $12
            </button>
        </div>
    );
}