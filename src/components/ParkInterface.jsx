import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { CarSuvSvg } from './CarIcons';
import { CAR_COMPONENTS } from './CarIcons';

const ParkInterface = ({ config, activeCarId, updateParking, setView, currentUser }) => {
    const car = config.cars.find(c => c.id === activeCarId) || config.cars[0];
    const CarIcon = CAR_COMPONENTS[car.iconType] || CarSuvSvg;
    // Read local grid preference, default to 2. User-specific.
    const gridCols = parseInt(localStorage.getItem(`pt_grid_columns_${currentUser}`) || '2');

    const spots = [];
    config.floors.forEach(floor => {
        config.sections.forEach(section => {
            spots.push({ floor, section, label: `${floor}${section}` });
        });
    });

    const getEffectiveTime = () => {
        const now = new Date();
        return { hours: now.getHours(), totalMinutes: now.getHours() * 60 + now.getMinutes() };
    };

    const time = getEffectiveTime();

    // Sky Gradient Logic
    const getSkyGradient = (t) => {
        const hour = t.totalMinutes / 60;
        // Morning (6:00 - 7:30)
        if (hour >= 6 && hour < 7.5) return 'bg-gradient-to-b from-orange-300 via-pink-300 to-blue-200';
        // Day (7:30 - 19:00)
        if (hour >= 7.5 && hour < 19) return 'bg-gradient-to-b from-sky-300 via-blue-200 to-white';
        // Sunset (19:00 - 20:30)
        if (hour >= 19 && hour < 20.5) return 'bg-gradient-to-b from-indigo-500 via-purple-500 to-orange-400';
        // Night (20:30 - 6:00)
        return 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800';
    };

    const skyClass = getSkyGradient(time);

    // Celestial Body Position Logic
    const getCelestialInfo = (t) => {
        const totalMinutes = t.totalMinutes;

        const dayStart = 7 * 60; // 7:00 AM
        const dayEnd = 19.5 * 60;  // 7:30 PM

        let isDay = totalMinutes >= dayStart && totalMinutes < dayEnd;
        let progress; // 0.0 to 1.0 representing path from Left to Right

        if (isDay) {
            progress = (totalMinutes - dayStart) / (dayEnd - dayStart);
        } else {
            // Night Cycle: 7:30 PM to 7:00 AM
            // If strictly > 19:30, it's early night. If < 7:00, it's late night.
            const nightOrphanMinutes = totalMinutes < dayStart ? totalMinutes + (24 * 60) : totalMinutes;
            const nightStart = 19.5 * 60;
            const nightEnd = (7 + 24) * 60; // 31 hours essentially
            progress = (nightOrphanMinutes - nightStart) / (nightEnd - nightStart);
        }

        // Calculate Position (Arc)
        // Left: linear 100% to 0% (Right to Left / Anticlockwise)
        // Bottom: Parabola/Sin wave. 0 at ends, peak at 50%.
        const left = `${(1 - progress) * 100}%`;
        // Constrain height: min 10%, max 75%
        const heightMultiplier = Math.sin(progress * Math.PI);
        const bottom = `${10 + (heightMultiplier * 65)}%`;

        return { isDay, left, bottom };
    };

    const celestial = getCelestialInfo(time);

    return (
        <motion.div
            className="flex flex-col h-full bg-slate-50"
            initial="initial"
            animate="animate"
            exit="exit"
        >

            {/* Animation Definitions */}
            <style>{`
                @keyframes reverse-park-linear {
                    0% {
                        transform: translateX(-200px);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes headlights-toggle {
                    0%, 90% { opacity: 0.8; }
                    100% { opacity: 0; }
                }
                .animate-reverse-linear {
                    animation: reverse-park-linear 1s cubic-bezier(0.2, 0, 0.2, 1) forwards;
                }
                .animate-headlights {
                    animation: headlights-toggle 4s steps(1) forwards;
                }
                @keyframes suspension-idle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-0.4px); }
                }
                .animate-idle { animation: suspension-idle 0.5s ease-in-out 8 forwards; }
            `}</style>

            {/* Scene Container (Sky & Road) */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 180, damping: 25 } }}
                exit={{ y: -100, opacity: 0 }}
                className={`relative flex-none h-[35%] min-h-[260px] w-full overflow-hidden ${skyClass} transition-colors duration-1000`}
            >

                {/* Back Button (Overlay) */}
                <button
                    onClick={() => setView('dashboard')}
                    className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/20 z-30 shadow-lg"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>





                {/* Sky Background & Celestial Body */}
                <div className="absolute inset-0">
                    {/* Stars (Only Visible at Night) */}
                    {!celestial.isDay && (
                        <div className="absolute inset-0 opacity-40">
                            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            <div className="absolute top-20 right-1/4 w-1 h-1 bg-white rounded-full"></div>
                            <div className="absolute top-1/3 left-1/3 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                    )}

                    {/* Celestial Body (Sun/Moon) */}
                    <div
                        className="absolute w-16 h-16 transition-all duration-300 ease-out z-0"
                        style={{ left: celestial.left, bottom: celestial.bottom, transform: 'translateX(-50%)' }}
                    >
                        {celestial.isDay ? (
                            // GEOMETRIC SUN
                            <div className="relative w-full h-full animate-[spin_40s_linear_infinite]">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <g className="text-amber-300">
                                        {[...Array(8)].map((_, i) => (
                                            <polygon key={i} points="45,5 55,5 50,20" transform={`rotate(${i * 45} 50 50)`} fill="currentColor" />
                                        ))}
                                    </g>
                                    <path d="M50 25 L72 37 L72 63 L50 75 L28 63 L28 37 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                                    <path d="M50 25 L50 50 L72 63" fill="none" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
                                    <path d="M50 50 L28 63" fill="none" stroke="#fcd34d" strokeWidth="1" opacity="0.5" />
                                </svg>
                            </div>
                        ) : (
                            // SHARP MOON
                            <div className="relative w-full h-full">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-100 drop-shadow-lg filter drop-shadow-white/20 overflow-visible">
                                    <g transform="translate(10, 10) scale(0.8)">
                                        <path d="M70 20 A 40 40 0 1 1 40 90 A 30 30 0 1 0 70 20 Z" fill="currentColor" />
                                        <circle cx="45" cy="50" r="3" fill="#cbd5e1" opacity="0.5" />
                                        <circle cx="55" cy="70" r="2" fill="#cbd5e1" opacity="0.5" />
                                    </g>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. LAYER: Elements (Back) */}
                {/* HDB Block (Right) - Iconic Red Pillar Style with Depth Overlay */}
                <svg className="absolute bottom-10 right-0 w-[45%] md:w-[30%] h-[90%] md:h-[320px] max-h-full" viewBox="0 -25 190 275" preserveAspectRatio="xMaxYMax meet">
                    {/* --- BACKGROUND TOWER (Depth Layer) --- */}
                    {/* Shifted Left & Darker */}
                    <g transform="translate(0, 10) scale(0.95)">
                        <rect x="10" y="50" width="25" height="170" fill="#991b1b" /> {/* Darker Red */}
                        <rect x="8" y="30" width="29" height="20" fill="#94a3b8" /> {/* Cap Section (Added) */}
                        <path d="M6 30 L22 15 L39 30" fill="#1e293b" />
                        <rect x="125" y="50" width="25" height="170" fill="#991b1b" />
                        <rect x="123" y="30" width="29" height="20" fill="#94a3b8" /> {/* Cap Section (Added) */}
                        <path d="M121 30 L137 15 L154 30" fill="#1e293b" />
                        <rect x="35" y="50" width="90" height="170" fill="#cbd5e1" /> {/* Dimmer White */}
                        {/* Dim Windows */}
                        {[...Array(6)].map((_, i) => (
                            <rect key={i} x="40" y={60 + i * 25} width="80" height="10" fill="#1e293b" opacity="0.4" />
                        ))}
                        {/* Background Void Deck (Added to fix floating) */}
                        <rect x="10" y="215" width="140" height="8" fill="#d97706" /> {/* Darker Yellow */}
                        <rect x="35" y="223" width="90" height="27" fill="#94a3b8" />
                        <rect x="10" y="223" width="25" height="27" fill="#cbd5e1" />
                        <rect x="125" y="223" width="25" height="27" fill="#cbd5e1" />
                    </g>

                    {/* --- FOREGROUND TOWER (Main) --- */}
                    <g transform="translate(40, 0)">
                        {/* --- LEFT RED PILLAR --- */}
                        <rect x="10" y="50" width="25" height="170" fill="#dc2626" />
                        <rect x="8" y="30" width="29" height="20" fill="#f1f5f9" />
                        <path d="M6 30 L22 15 L39 30" fill="#334155" />

                        {/* --- RIGHT RED PILLAR --- */}
                        <rect x="125" y="50" width="25" height="170" fill="#dc2626" />
                        <rect x="123" y="30" width="29" height="20" fill="#f1f5f9" />
                        <path d="M121 30 L137 15 L154 30" fill="#334155" />

                        {/* --- MAIN BUILDING BODY --- */}
                        <rect x="35" y="50" width="90" height="170" fill="#f8fafc" />

                        {/* Horizontal Corridors */}
                        {[...Array(10)].map((_, i) => (
                            <rect key={i} x="35" y={60 + i * 15} width="90" height="2" fill="#cbd5e1" />
                        ))}

                        {/* Windows */}
                        {[...Array(10)].map((_, i) => (
                            <g key={i} fill="#334155" opacity="0.8">
                                <rect x="45" y={52 + i * 15} width="8" height="6" />
                                <rect x="58" y={52 + i * 15} width="8" height="6" />
                                <rect x="71" y={52 + i * 15} width="8" height="6" />
                                <rect x="84" y={52 + i * 15} width="8" height="6" />
                                <rect x="97" y={52 + i * 15} width="8" height="6" />
                                <rect x="110" y={52 + i * 15} width="8" height="6" />
                            </g>
                        ))}

                        {/* --- VOID DECK --- */}
                        <rect x="10" y="215" width="140" height="8" fill="#fbbf24" />
                        <rect x="35" y="223" width="90" height="27" fill="#e2e8f0" />
                        <rect x="10" y="223" width="25" height="27" fill="#f8fafc" />
                        <rect x="125" y="223" width="25" height="27" fill="#f8fafc" />
                        <rect x="65" y="223" width="10" height="27" fill="#f1f5f9" />
                        <rect x="0" y="248" width="160" height="2" fill="#334155" opacity="0.5" />
                    </g>
                </svg>

                {/* Tree (Left) */}
                <svg className="absolute bottom-10 left-0 w-[20%] h-[45%]" viewBox="0 0 100 130" preserveAspectRatio="xMinYMax meet">
                    {/* Trunk (Rectangular Base) */}
                    <rect x="46" y="60" width="8" height="70" fill="#5d4037" />
                    {/* Branches */}
                    <path d="M50 60 Q45 50 35 40 M50 60 Q55 50 65 45" stroke="#5d4037" strokeWidth="6" strokeLinecap="round" fill="none" />
                    {/* Leaves - Bushy Canopy */}
                    <circle cx="35" cy="40" r="20" fill="#15803d" />
                    <circle cx="65" cy="45" r="18" fill="#166534" />
                    <circle cx="50" cy="25" r="22" fill="#22c55e" />
                    <circle cx="50" cy="45" r="20" fill="#14532d" />
                </svg>

                {/* Road */}
                <div className="absolute bottom-0 inset-x-0 h-16 bg-slate-700 border-t-4 border-slate-600 overflow-hidden">
                    {/* Road Markings (Stop at curb) */}
                    <div className="absolute top-1/2 left-0 right-[25%] h-px border-t-2 border-dashed border-slate-500 opacity-50"></div>
                </div>

                {/* Curb Overlay (Covers Road Border) */}
                <svg className="absolute right-0 bottom-0 w-[25%] h-[69px] z-30" viewBox="0 0 100 150" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <defs>
                        <filter id="concreteNoise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                        </filter>
                        {/* Define Shape Once */}
                        <path id="curbShape" d="M 0 10 L 100 10 L 100 150 L 25 150 Z" />
                        <clipPath id="curbClip">
                            <use href="#curbShape" />
                        </clipPath>
                    </defs>

                    {/* 1. Base Color (Solid) */}
                    <use href="#curbShape" fill="#d6d3d1" stroke="#a8a29e" strokeWidth="1" />

                    {/* 2. Texture (Skewed Rect + Clipped) */}
                    <g clipPath="url(#curbClip)">
                        {/* Skewed rect to create sloped noise, clipped to curb shape */}
                        <rect x="-50" y="-50" width="250" height="250" fill="transparent" filter="url(#concreteNoise)" opacity="0.4" style={{ mixBlendMode: 'multiply' }} transform="skewX(-20)" transform-origin="50 50" />
                    </g>

                    {/* 3. Highlights (On Top) */}
                    <path d="M 0 10 L 100 10" stroke="white" strokeWidth="2" opacity="0.9" />
                    <path d="M 0 10 L 25 150" stroke="#78716c" strokeWidth="1" opacity="0.5" />

                    {/* Left Brown Curb Edge (Road Touching) */}
                    <path d="M 0 10 L 25 150" stroke="#78350f" strokeWidth="4" />
                </svg>

                {/* Car (On Road) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20">
                    <div className="animate-reverse-linear relative">
                        {/* Shadow */}
                        <div className="absolute bottom-2 left-4 right-4 h-4 bg-black blur-md opacity-60 rounded-[100%] z-0"></div>

                        {/* Single Trapezoid Headlight (Under Car) */}
                        <div className="animate-headlights absolute top-[65%] -left-32 -translate-y-1/2 w-40 h-16 pointer-events-none mix-blend-plus-lighter origin-right -z-10">
                            <div className="absolute inset-0 bg-gradient-to-l from-yellow-100/50 via-yellow-100/10 to-transparent"
                                style={{ clipPath: 'polygon(100% 40%, 0% 0%, 0% 100%, 100% 60%)' }}></div>
                        </div>

                        {/* Car Icon */}
                        <div className="w-56 h-36 relative z-20 animate-idle" style={{ color: car.color }}>
                            <CarIcon
                                className="w-full h-full"
                                idPrefix={car.id}
                                style={{ filter: 'drop-shadow(0 20px 15px rgba(0,0,0,0.5)) drop-shadow(0 -2px 3px rgba(255,255,255,0.95)) brightness(1.05)' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Foreground Sign (Car Name) */}
                <div className="absolute bottom-0 right-[1%] z-50 pointer-events-none origin-bottom">
                    <svg className="w-32 h-48 drop-shadow-2xl" viewBox="0 0 200 150" preserveAspectRatio="xMidYMax meet">
                        {/* Pole (Offset slightly right for perspective) */}
                        <defs>
                            <linearGradient id="poleFgGrad" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#64748b" />
                                <stop offset="40%" stopColor="#e2e8f0" />
                                <stop offset="100%" stopColor="#475569" />
                            </linearGradient>
                        </defs>
                        <rect x="110" y="25" width="10" height="80" fill="url(#poleFgGrad)" />

                        {/* Sign Board (Rotated/Skewed in SVG?) No, parent skew is enough. */}
                        <g transform="translate(120, 30)">
                            {/* Text Car Name */}
                            <rect x="-70" y="-25" width="140" height="50" rx="4" fill="#15803d" stroke="white" strokeWidth="3" />
                            <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24" fontWeight="900" fontFamily="sans-serif">
                                {car.name.toUpperCase()}
                            </text>
                        </g>
                    </svg>
                </div>
            </motion.div>

            {/* Parking Grid */}
            <div className="flex-1 overflow-y-auto p-4 pt-6 pb-12 scrollbar-hide">
                <motion.div
                    className="grid gap-3 pb-8"
                    style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                    variants={{
                        animate: { transition: { staggerChildren: 0.01, delayChildren: 0.2 } },
                        exit: { transition: { staggerChildren: 0.01, staggerDirection: -1 } }
                    }}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    {spots.map((spot, idx) => (
                        <motion.button
                            key={idx}
                            variants={{
                                initial: { y: 50, opacity: 0, scale: 0.8 },
                                animate: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 250, damping: 20 } },
                                exit: { y: 20, opacity: 0, scale: 0.9 }
                            }}
                            onClick={() => updateParking(car.id, spot.floor, spot.section)}
                            className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm aspect-[4/3] flex flex-col items-center justify-center active:scale-95 active:border-blue-500 active:bg-blue-50 transition-colors hover:border-slate-300 group"
                        >
                            <span className="text-5xl font-black text-slate-700 group-hover:text-blue-600 group-active:text-blue-700">
                                {spot.label}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ParkInterface;
