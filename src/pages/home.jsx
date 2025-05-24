import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import BrandsSpace from "../components/brandsSpace";



export default function Home() {
    const [show, setShow] = useState(false);


    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            className={`w-full h-full px-6 py-40 bg-gray-100 flex flex-col items-center gap-8 transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
        >
            <div className="flex flex-col items-center gap-2 text-center py-20">
                <h1 className="text-[72px] leading-[86.4px] font-bold text-[#1E1E1E]">
                    Repuestos de confianza
                </h1>
                <p className="text-2xl md:text-3xl text-[#555555] leading-[38.4px]">
                    Calidad y variedad, al servicio de tu taller
                </p>
            </div>


            <div className="w-60 flex justify-center items-center gap-4">
                <Link to="/productos" className="w-full">
                    <button className="w-full py-3 px-4 bg-[#D72638] border border-[#BB2F3D] rounded-lg text-[#F5F5F5] text-base font-medium hover:scale-105 active:scale-95 transition-transform">
                        Explora nuestro catálogo
                    </button>
                </Link>
            </div>

            <div className="h-40"> </div>

            <BrandsSpace />

        </div>


    );
}
