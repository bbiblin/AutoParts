import { useEffect, useState } from 'react';

export default function AdminHome() {
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
                    Bienvenido,
                </h1>
                <p className="text-2xl md:text-3xl text-[#555555] leading-[38.4px]">
                    Selecciona alguna de las opciones de arriba
                </p>
            </div>


        </div>


    );
    
}
