import React from 'react';

export const CarSuvSvg = ({ className, idPrefix = '' }) => (
    <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id={`bodyGrad${idPrefix}`} x1="100" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                <stop stopColor="currentColor" stopOpacity="1" />
                <stop offset="1" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id={`windowGrad${idPrefix}`} x1="100" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE" stopOpacity="0.8" />
                <stop offset="1" stopColor="#38BDF8" stopOpacity="0.5" />
            </linearGradient>
        </defs>
        <ellipse cx="100" cy="130" rx="90" ry="25" fill="currentColor" fillOpacity="0.2" />
        <circle cx="60" cy="110" r="18" fill="#1F2937" />
        <circle cx="150" cy="105" r="18" fill="#1F2937" />
        <path d="M20 90 C20 80 30 55 40 50 L160 40 C170 40 185 50 185 85 L180 110 C180 120 170 125 160 120 L40 125 C30 125 20 120 20 90 Z" fill={`url(#bodyGrad${idPrefix})`} />
        <path d="M45 50 L55 25 L150 20 L160 40 L45 50 Z" fill="currentColor" filter="brightness(0.7)" />
        <path d="M58 28 L145 24 L152 38 L50 46 Z" fill={`url(#windowGrad${idPrefix})`} />
        <line x1="90" y1="26" x2="85" y2="44" stroke="currentColor" strokeWidth="3" />
        <line x1="120" y1="25" x2="120" y2="40" stroke="currentColor" strokeWidth="3" />
        <g transform="translate(50, 115)">
            <circle cx="0" cy="0" r="20" fill="#374151" />
            <circle cx="0" cy="0" r="12" fill="#E5E7EB" />
        </g>
        <g transform="translate(145, 110)">
            <circle cx="0" cy="0" r="20" fill="#374151" />
            <circle cx="0" cy="0" r="12" fill="#E5E7EB" />
        </g>
        <circle cx="36" cy="88" r="8" fill="white" />
        {/* Roof Highlight */}
        <path d="M45 53 L155 43" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    </svg>
);

export const CarSedanSvg = ({ className = "", idPrefix = "sedan" }) => (
    <svg
        viewBox="0 0 200 160"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Sedan Side Profile"
    >
        <defs>
            <linearGradient id={`${idPrefix}_bodyGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="1.0" />
            </linearGradient>
            <linearGradient id={`${idPrefix}_windowGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" />
                <stop offset="100%" stopColor="#4682B4" />
            </linearGradient>
        </defs>

        {/* Base Shadow */}
        <ellipse cx="100" cy="148" rx="90" ry="4" fill="#000" opacity="0.2" />

        {/* Front Wheel (Now on Left) */}
        <g transform="translate(45, 125)">
            <circle cx="0" cy="0" r="17" fill="#333" />
            <circle cx="0" cy="0" r="10" fill="#999" />
        </g>

        {/* Rear Wheel (Now on Right) */}
        <g transform="translate(155, 125)">
            <circle cx="0" cy="0" r="17" fill="#333" />
            <circle cx="0" cy="0" r="10" fill="#999" />
        </g>

        {/* Main Body - Generic Wagon Profile */}
        <path
            d="M 8 125 
           L 8 105 
           Q 8 98 15 95 
           L 45 90 
           L 65 65 
           L 155 65 
           L 185 90 
           L 190 105 
           L 190 125 
           L 174 125 
           A 20 20 0 0 1 136 125 
           L 64 125 
           A 20 20 0 0 1 26 125 
           Z"
            fill={`url(#${idPrefix}_bodyGrad)`}
        />

        {/* Windows */}
        <path
            d="M 68 69 
           L 152 69 
           Q 162 69 162 82 
           L 162 92 
           L 50 92 
           L 50 90 Z"
            fill={`url(#${idPrefix}_windowGrad)`}
        />

        {/* Roof Rails and Bike Rack (Optional - kept for style) */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
            {/* Base Roof Rails */}
            <path d="M 65 63 L 155 63" opacity="0.8" />

            {/* Bike Rack Structure */}
            <path d="M 90 63 L 90 58 L 105 58 L 105 63" strokeWidth="1.5" />
            <path d="M 97 58 L 97 48 M 100 58 L 102 50" strokeWidth="1.5" />
            <path d="M 125 63 L 125 58 L 140 58 L 140 63" strokeWidth="1.5" />
            <path d="M 132 58 L 132 48 M 135 58 L 137 50" strokeWidth="1.5" />
            <path d="M 88 58 L 142 58" strokeWidth="2" />
        </g>

        {/* Highlight on Front Hood */}
        <path
            d="M 15 96 Q 25 92 40 92"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.4"
            strokeLinecap="round"
        />
    </svg>
);

export const CarHatchSvg = ({ className, idPrefix = '' }) => (
    <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id={`bodyGradH${idPrefix}`} x1="100" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="25%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="1" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id={`windowGradH${idPrefix}`} x1="100" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE" stopOpacity="0.8" />
                <stop offset="1" stopColor="#38BDF8" stopOpacity="0.5" />
            </linearGradient>
        </defs>
        <ellipse cx="90" cy="130" rx="80" ry="20" fill="currentColor" fillOpacity="0.2" />
        <circle cx="50" cy="115" r="17" fill="#1F2937" />
        <circle cx="140" cy="115" r="17" fill="#1F2937" />
        {/* Body: Compact and tall */}
        <path d="M15 95 C15 80 25 55 40 50 L140 45 C150 45 155 50 155 100 L150 115 L40 120 C30 120 15 115 15 95 Z" fill={`url(#bodyGradH${idPrefix})`} />
        <path d="M40 50 L55 25 L135 25 L145 50 Z" fill="currentColor" filter="brightness(0.7)" />
        <path d="M58 28 L132 28 L138 45 L50 46 Z" fill={`url(#windowGradH${idPrefix})`} />
        <g transform="translate(50, 115)">
            <circle cx="0" cy="0" r="19" fill="#374151" />
            <circle cx="0" cy="0" r="12" fill="#E5E7EB" />
        </g>
        <g transform="translate(140, 115)">
            <circle cx="0" cy="0" r="19" fill="#374151" />
            <circle cx="0" cy="0" r="12" fill="#E5E7EB" />
        </g>
        <circle cx="28" cy="90" r="8" fill="white" />
        {/* Roof Highlight */}
        <path d="M45 52 L140 47" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    </svg>
);

export const CarTruckSvg = ({ className, idPrefix = '' }) => (
    <svg viewBox="0 0 200 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id={`bodyGradT${idPrefix}`} x1="100" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="25%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="1" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id={`windowGradT${idPrefix}`} x1="100" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE" stopOpacity="0.8" />
                <stop offset="1" stopColor="#38BDF8" stopOpacity="0.5" />
            </linearGradient>
        </defs>
        <ellipse cx="100" cy="130" rx="90" ry="20" fill="currentColor" fillOpacity="0.2" />
        <circle cx="50" cy="115" r="20" fill="#1F2937" />
        <circle cx="150" cy="115" r="20" fill="#1F2937" />
        {/* Body: Cab and Bed */}
        <path d="M10 90 C10 70 20 50 40 50 L90 48 L180 55 L180 90 L175 110 L25 115 Z" fill={`url(#bodyGradT${idPrefix})`} />
        {/* Cabin */}
        <path d="M40 50 L50 25 L95 25 L100 50 Z" fill="currentColor" filter="brightness(0.7)" />
        <path d="M55 28 L90 28 L94 46 L48 46 Z" fill={`url(#windowGradT${idPrefix})`} />
        <g transform="translate(50, 115)">
            <circle cx="0" cy="0" r="22" fill="#374151" />
            <circle cx="0" cy="0" r="14" fill="#E5E7EB" />
        </g>
        <g transform="translate(150, 115)">
            <circle cx="0" cy="0" r="22" fill="#374151" />
            <circle cx="0" cy="0" r="14" fill="#E5E7EB" />
        </g>
        <rect x="20" y="80" width="10" height="15" fill="white" rx="2" />
        {/* Cab Highlight */}
        <path d="M42 52 L90 50" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
    </svg>
);

export const CarSportSvg = ({ className = '', idPrefix = 'sport' }) => {
    const bodyGradId = `${idPrefix}-bodyGrad`;
    const windowGradId = `${idPrefix}-windowGrad`;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 160"
            className={className}
            aria-label="Sport Car Profile"
            role="img"
        >
            <defs>
                {/* Body Gradient: Uses currentColor to support the color picker */}
                <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" />
                </linearGradient>

                {/* Window Gradient: Dark tinted glass reflection */}
                <linearGradient id={windowGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="1" />
                    <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.9" />
                </linearGradient>
            </defs>

            {/* Base Shadow */}
            <ellipse cx="100" cy="128" rx="90" ry="6" fill="black" opacity="0.25" />

            {/* Wheels (Back Layer) - Dark rims */}
            <g fill="#222" stroke="#444" strokeWidth="1">
                {/* Front Wheel (Left) */}
                <circle cx="48" cy="114" r="15" />
                <circle cx="48" cy="114" r="5" fill="#555" stroke="none" />

                {/* Rear Wheel (Right) */}
                <circle cx="152" cy="114" r="15" />
                <circle cx="152" cy="114" r="5" fill="#555" stroke="none" />
            </g>

            {/* Main Body - Low Sport Profile */}
            <path
                d="M 5 114 
           Q 5 92 25 88 
           L 60 86 
           L 85 70 
           L 130 66 160 85 
           L 188 98 
           Q 190 102 190 108 
           L 190 114 
           L 168 114 
           A 17 17 0 0 1 136 114 
           L 64 114 
           A 17 17 0 0 1 32 114 
           L 5 114 
           Z"
                fill={`url(#${bodyGradId})`}
                stroke="none"
            />

            {/* Windows */}
            <path
                d="M 64 86 
           L 87 73 
           Q 125 71 148 85 
           L 162 92 
           L 135 92 
           L 132 76 
           L 128 76 
           L 131 92 
           Z"
                fill={`url(#${windowGradId})`}
            />

            {/* Headlight/Nose Detail */}
            <path d="M 5 102 L 18 100 L 18 106 Z" fill="white" opacity="0.4" />

            {/* Roof Highlight Line */}
            <path d="M 65 86 L 130 92" stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
        </svg>
    );
};

export const CAR_COMPONENTS = {
    suv: CarSuvSvg,
    sedan: CarSedanSvg,
    hatch: CarHatchSvg,
    truck: CarTruckSvg,
    sport: CarSportSvg
};

export const CustomCarIcon = ({ className, style, svgString }) => {
    if (!svgString) return null;

    // sizing override: ensure SVG takes parent/wrapper size
    // We add a class to the wrapper that targets the child SVG
    return (
        <div
            className={`${className} custom-car-icon [&>svg]:w-full [&>svg]:h-full`}
            style={{ ...style, display: 'flex', alignItems: 'center', justifyItems: 'center' }}
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
};
