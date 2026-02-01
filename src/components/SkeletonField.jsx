import React from 'react';

const SkeletonField = ({ width, height, className = '' }) => {
    return (
        <div
            className={`bg-slate-200 animate-pulse rounded ${className}`}
            style={{ width, height }}
        />
    );
};

export default SkeletonField;
