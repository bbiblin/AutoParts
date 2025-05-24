"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Bosch from "../img/Bosch_logo.png";
import Monroe from "../img/monroe.svg";
import NGK from "../img/NGK_logo.png";
import Mobil from "../img/Mobil_logo.png";

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
                    { name: "BOSCH", src: Bosch },
                    { name: "MOBIL", src: Mobil },
                    { name: "MONROE", src: Monroe },
                    { name: "NGK", src: NGK },
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
