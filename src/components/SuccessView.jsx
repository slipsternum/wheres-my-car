import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const CONFETTI_COLOURS = ['#f59e0b', '#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];

// Confetti falling from the top of the screen, drawn on a canvas
const ConfettiRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const pieces = [];
        const start = performance.now();
        const duration = 3400;
        let spawned = 0;
        let frameId;

        const frame = (now) => {
            const elapsed = now - start;

            // Start once the medal has landed, alongside the stamp
            if (elapsed > 900 && elapsed < 2000 && spawned < 120) {
                for (let i = 0; i < 4; i++, spawned++) {
                    pieces.push({
                        x: Math.random() * w,
                        y: -12,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: 1.5 + Math.random() * 2.5,
                        w: 5 + Math.random() * 5,
                        h: 8 + Math.random() * 6,
                        rot: Math.random() * Math.PI,
                        vr: (Math.random() - 0.5) * 0.35,
                        tilt: Math.random() * Math.PI * 2,
                        colour: CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)]
                    });
                }
            }

            ctx.clearRect(0, 0, w, h);
            const fade = Math.min(1, Math.max(0, (duration - elapsed) / 500));
            pieces.forEach((p, i) => {
                p.vx *= 0.985;
                p.vy = p.vy * 0.985 + 0.06;
                p.x += p.vx + Math.sin(elapsed / 300 + i) * 0.4;
                p.y += p.vy;
                p.rot += p.vr;
                p.tilt += 0.12;

                ctx.save();
                ctx.globalAlpha = fade;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(1, Math.cos(p.tilt));
                ctx.fillStyle = p.colour;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (elapsed < duration) frameId = requestAnimationFrame(frame);
        };

        frameId = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};

// Shown instead of "Saved" when parking in the configured best spot
const BestSpotView = ({ spot }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="relative h-full flex flex-col items-center text-center overflow-hidden bg-gradient-to-b from-sky-100 via-white to-white"
        >
            {!reduceMotion && <ConfettiRain />}

            {/* Medal on a ribbon, dropping in from the top and swinging */}
            <motion.div
                className="flex flex-col items-center"
                style={{ transformOrigin: '50% 0' }}
                initial={reduceMotion ? false : { y: -400, rotate: 0 }}
                animate={{ y: 0, rotate: reduceMotion ? 0 : [0, 12, -8, 5, -2, 0] }}
                transition={{
                    y: { type: 'spring', stiffness: 260, damping: 16 },
                    rotate: { delay: 0.55, duration: 2.2, ease: 'easeOut' }
                }}
            >
                <svg className="w-16 h-[34dvh] min-h-24" viewBox="0 0 64 108" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M8 0h20l14 108H22z" fill="#1d4ed8" />
                    <path d="M36 0h20L42 108H22z" fill="#dc2626" />
                </svg>
                <div
                    className="-mt-1.5 w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black tracking-tight text-amber-900"
                    style={{
                        background: 'radial-gradient(circle at 35% 30%, #fde68a, #fbbf24 55%, #d97706)',
                        boxShadow: 'inset 0 0 0 6px rgba(255,255,255,0.35), 0 10px 22px -8px rgba(146,64,14,0.6)'
                    }}
                >
                    {spot}
                </div>
            </motion.div>

            {/* Stamp */}
            <motion.div
                className="mt-8 px-4 py-1 rounded-xl border-[3px] border-red-600 bg-white/70 text-red-600 text-3xl font-black tracking-widest"
                initial={reduceMotion ? false : { scale: 3.2, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: -8 }}
                transition={{ delay: 1, duration: 0.38, ease: [0.5, 0, 0.75, 0] }}
            >
                BEST SPOT
            </motion.div>

            <motion.div
                className="mt-6 px-6"
                initial={reduceMotion ? false : { y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.35, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <h2 className="text-3xl font-black text-slate-800">Nice parking!</h2>
                <p className="mt-2 text-base font-semibold text-slate-500">Congratulations on getting {spot}</p>
            </motion.div>
        </motion.div>
    );
};

const SuccessView = ({ celebrateSpot }) => {
    if (celebrateSpot) return <BestSpotView spot={celebrateSpot} />;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            className="h-full flex flex-col items-center justify-center text-center bg-white"
        >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 animate-in zoom-in duration-300">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-800">Saved</h2>
        </motion.div>
    );
};

export default SuccessView;
