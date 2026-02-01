import React, { useEffect, useState, useRef } from 'react';

const Toast = ({ message, onClose }) => {
    const [visible, setVisible] = useState(false);
    const onCloseRef = useRef(onClose);

    // Keep ref updated to latest callback
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Wait for animation to finish before calling close
                setTimeout(() => {
                    if (onCloseRef.current) onCloseRef.current();
                }, 500);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]); // onClose is removed from deps (handled via ref)

    if (!message) return null;

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform 
            ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90 pointer-events-none'}`}
        >
            <div className="bg-white/90 backdrop-blur-md text-slate-800 px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100/50 flex items-center gap-3 font-bold text-sm">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
