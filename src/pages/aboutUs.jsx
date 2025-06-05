import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Shield, Award, Users, Wrench, Clock, MapPin } from 'lucide-react';

export default function AboutUs() {
    const [show, setShow] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const [visibleCards, setVisibleCards] = useState([]);
    
    const heroRef = useRef(null);
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const statsRef = useRef(null);
    const commitmentRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.getAttribute('data-section');
                    setVisibleSections(prev => ({ ...prev, [sectionName]: true }));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        const sections = [heroRef, storyRef, valuesRef, statsRef, commitmentRef, ctaRef];
        sections.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            sections.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisibleCards([0, 1, 2, 3, 4, 5]);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const values = [
        {
            icon: Shield,
            title: "Calidad garantizada",
            description: "Trabajamos con prestigiosas marcas de repuestos tales como Bosch, NGK Monroe y Mobil, asegurando calidad y variedad en nuestro catálogo."
        },
        {
            icon: Award,
            title: "Experiencia comprobada",
            description: "Fundados en los años 80's, contamos con mas de 30 años de experiencia en nuestro sector."
        },
        {
            icon: Users,
            title: "Atención personalizada",
            description: "Nuestro equipo de expertos te guía para encontrar exactamente lo que necesitas para tu vehículo."
        }
    ];

    const stats = [
        { number: "30+", label: "Años de experiencia" },
        { number: "5000+", label: "Clientes satisfechos" },
        { number: "10000+", label: "Repuestos en stock" }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div
                className={`w-full px-6 py-40 flex flex-col items-center gap-8 transition-all duration-700 ease-out ${
                    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                <div className="flex flex-col items-center gap-2 text-center py-20">
                    <h1 className="text-[72px] leading-[86.4px] font-bold text-[#1E1E1E]">
                        Nuestra Historia
                    </h1>
                    <p className="text-2xl md:text-3xl text-[#555555] leading-[38.4px] max-w-4xl">
                        Comprometidos con la excelencia en repuestos automotrices desde 2009
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="w-full px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div
                        ref={storyRef}
                        data-section="story"
                        className={`bg-white rounded-2xl p-12 shadow-lg transition-all duration-700 ease-out ${
                            visibleSections.story ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold text-[#1E1E1E]">
                                    Construyendo confianza pieza por pieza
                                </h2>
                                <p className="text-lg text-[#555555] leading-relaxed">
                                    Lo que comenzó como un pequeño taller familiar se ha convertido en una de las 
                                    distribuidoras de repuestos automotrices más confiables de la región. Nuestra 
                                    pasión por los automóviles y el compromiso con la calidad nos han llevado a 
                                    establecer relaciones duraderas con talleres, mecánicos y propietarios de vehículos.
                                </p>
                                <p className="text-lg text-[#555555] leading-relaxed">
                                    Cada repuesto que vendemos representa nuestra promesa de calidad, durabilidad 
                                    y confiabilidad. Trabajamos únicamente con marcas reconocidas y proveedores 
                                    certificados para garantizar que tu vehículo reciba siempre lo mejor.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="bg-[#D72638] rounded-2xl p-8 transform rotate-3 shadow-xl">
                                    <Wrench className="w-24 h-24 text-[#FFFF] mx-auto mb-4" />
                                    <p className="text-[#FFFF] text-center font-medium">
                                        "La calidad no es un accidente, es el resultado de un esfuerzo inteligente"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div ref={valuesRef} data-section="values" className="w-full px-6 py-20 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className={`text-center mb-16 transition-all duration-700 ease-out ${
                        visibleSections.values ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}>
                        <h2 className="text-5xl font-bold text-[#1E1E1E] mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-xl text-[#555555]">
                            Los principios que guían cada decisión que tomamos
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const IconComponent = value.icon;
                            return (
                                <div
                                    key={index}
                                    className={`bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-700 ease-out ${
                                        visibleSections.values
                                            ? "opacity-100 translate-y-0 scale-100"
                                            : "opacity-0 translate-y-10 scale-95"
                                    }`}
                                    style={{ 
                                        transitionDelay: visibleSections.values ? `${index * 200}ms` : '0ms'
                                    }}
                                >
                                    <div className="bg-[#D72638] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                                        {value.title}
                                    </h3>
                                    <p className="text-[#555555] leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div ref={statsRef} data-section="stats" className="w-full px-6 py-20 bg-[#1E1E1E]">
                <div className="max-w-4xl mx-auto">
                    <div className={`text-center mb-16 transition-all duration-700 ease-out ${
                        visibleSections.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}>
                        <h2 className="text-5xl font-bold text-[#ffff] mb-4">
                            Números que nos respaldan
                        </h2>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center transition-all duration-700 ease-out ${
                                    visibleSections.stats
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-10"
                                }`}
                                style={{ 
                                    transitionDelay: visibleSections.stats ? `${index * 200}ms` : '0ms'
                                }}
                            >
                                <div className="text-6xl font-bold text-[#D72638] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-xl text-[#ffff]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div ref={commitmentRef} data-section="commitment" className="w-full px-6 py-20 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className={`text-center mb-16 transition-all duration-700 ease-out ${
                        visibleSections.commitment ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}>
                        <h2 className="text-5xl font-bold text-[#1E1E1E] mb-4">
                            Nuestro Compromiso
                        </h2>
                        <p className="text-xl text-[#555555] max-w-3xl mx-auto">
                            Más que una tienda de repuestos, somos tu socio confiable en el mantenimiento 
                            y reparación de tu vehículo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div
                            className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-700 ease-out ${
                                visibleCards.includes(4)
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-10"
                            }`}
                        >
                            <Clock className="w-12 h-12 text-[#D72638] mb-4" />
                            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                                Servicio Rápido
                            </h3>
                            <p className="text-[#555555] leading-relaxed">
                                Entendemos que el tiempo es valioso. Por eso mantenemos un amplio inventario 
                                y procesamos los pedidos con la máxima eficiencia para que puedas volver 
                                a la carretera lo antes posible.
                            </p>
                        </div>

                        <div
                            className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-700 ease-out ${
                                visibleCards.includes(5)
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-10"
                            }`}
                        >
                            <MapPin className="w-12 h-12 text-[#D72638] mb-4" />
                            <h3 className="text-2xl font-bold text-[#1E1E1E] mb-4">
                                Presencia Local
                            </h3>
                            <p className="text-[#555555] leading-relaxed">
                                Somos parte de esta comunidad. Conocemos las necesidades específicas 
                                de los vehículos en nuestra región y nos enorgullece contribuir al 
                                desarrollo de la industria automotriz local.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-full px-6 py-20 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        ref={ctaRef}
                        data-section="cta"
                        className={`transition-all duration-700 ease-out ${
                            visibleSections.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    >
                        <h2 className="text-5xl font-bold text-[#1E1E1E] mb-6">
                            ¿Listo para experimentar la diferencia?
                        </h2>
                        <p className="text-xl text-[#555555] mb-8 max-w-2xl mx-auto">
                            Descubre por qué miles de clientes confían en nosotros para mantener 
                            sus vehículos en perfectas condiciones
                        </p>
                
                    </div>
                </div>
            </div>
        </div>
    );
}