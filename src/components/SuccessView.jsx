import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SuccessView = () => (
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

export default SuccessView;
