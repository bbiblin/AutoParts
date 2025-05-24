"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function MarcasSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="w-full px-6 py-24 bg-white flex flex-col items-center gap-12"
            style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "none" : "translateY(40px)",
                transition: "all 0.6s ease-out",
            }}
        >
            <h2 className="text-4xl md:text-5xl font-bold text-center text-[#1E1E1E] p-40px">
                Marcas con las que trabajamos
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 w-full max-w-6xl px-4">
                {[
                    { name: "BOSCH", src: "public/logos/Bosch_logo.png" },
                    { name: "MOBIL", src: "public/logos/Mobil_logo.png" },
                    { name: "MONROE", src: "public/logos/monroe.svg" },
                    { name: "NGK", src: "public/logos/NGK_logo.png" },
                ].map((marca) => (
                    <div key={marca.name} className="flex justify-center items-center">
                        <img
                            src={marca.src}
                            alt={marca.name}
                            className="h-16 md:h-20 object-contain grayscale hover:grayscale-0 transition duration-300"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
