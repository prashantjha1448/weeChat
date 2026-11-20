import React from 'react';

/**
 * GlassSkeleton — Apple Shimmer Loading Placeholder Primitive
 * Prevents layout shift with subtle pulse/shimmer.
 */
export const GlassSkeleton = ({
    className = '',
    rounded = 'rounded-2xl',
    ...props
}) => {
    return (
        <div
            className={`bg-black/[0.06] dark:bg-white/[0.08] animate-pulse ${rounded} ${className}`}
            {...props}
        />
    );
};

export default GlassSkeleton;
