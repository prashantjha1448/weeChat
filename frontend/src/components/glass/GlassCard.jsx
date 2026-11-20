import React from 'react';

/**
 * GlassCard — Apple Glassmorphism Card Primitive
 * @param {('1'|'2'|'3'|'video')} level - Glass surface tier (default '1')
 * @param {boolean} interactive - Whether card has hover/focus interactive treatment
 */
export const GlassCard = ({
    children,
    level = '1',
    interactive = false,
    className = '',
    as: Component = 'div',
    ...props
}) => {
    const levelClass = level === '2' 
        ? 'glass-2' 
        : level === '3' 
        ? 'glass-3' 
        : level === 'video' 
        ? 'glass-video' 
        : 'glass-1';

    const interactiveClass = interactive 
        ? 'btn-spring hover:scale-[1.01] hover:border-white/60 dark:hover:border-white/20 cursor-pointer' 
        : '';

    return (
        <Component
            className={`${levelClass} ${interactiveClass} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
};

export default GlassCard;
