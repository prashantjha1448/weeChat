import helmet from 'helmet';
import hpp from 'hpp';

/**
 * Configure Helmet & Security Headers
 */
export const helmetSecurity = helmet({
    contentSecurityPolicy: false, // Disabled CSP inline restrictions for video/canvas streams
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

/**
 * Configure HTTP Parameter Pollution Protection
 */
export const hppProtection = hpp();
