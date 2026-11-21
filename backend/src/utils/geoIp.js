/**
 * GeoIP & Device User-Agent Parsing Utility
 * Extracts OS, Browser, Device Type, and Location for Admin Session Tracking
 */

export const parseUserAgent = (userAgentString = '') => {
    if (!userAgentString || typeof userAgentString !== 'string') {
        return {
            browser: 'Unknown Browser',
            os: 'Unknown OS',
            deviceType: 'Desktop',
            label: 'Unknown Device'
        };
    }

    const ua = userAgentString;
    let browser = 'Web Browser';
    let os = 'Unknown OS';
    let deviceType = 'Desktop';

    // Detect OS
    if (/iPad|Tablet/i.test(ua)) {
        os = 'iPadOS / Tablet';
        deviceType = 'Tablet';
    } else if (/iPhone/i.test(ua)) {
        os = 'iOS (iPhone)';
        deviceType = 'Mobile';
    } else if (/Android/i.test(ua)) {
        os = 'Android';
        deviceType = /Mobile/i.test(ua) ? 'Mobile' : 'Tablet';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        os = 'macOS';
        deviceType = 'Desktop';
    } else if (/Windows NT 10.0/i.test(ua)) {
        os = 'Windows 10/11';
        deviceType = 'Desktop';
    } else if (/Windows/i.test(ua)) {
        os = 'Windows';
        deviceType = 'Desktop';
    } else if (/Linux/i.test(ua)) {
        os = 'Linux';
        deviceType = 'Desktop';
    }

    // Detect Browser
    if (/Edg\//i.test(ua)) {
        browser = 'Microsoft Edge';
    } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
        browser = 'Google Chrome';
    } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
        browser = 'Apple Safari';
    } else if (/Firefox\//i.test(ua)) {
        browser = 'Mozilla Firefox';
    } else if (/Opera|OPR\//i.test(ua)) {
        browser = 'Opera';
    }

    return {
        browser,
        os,
        deviceType,
        label: `${os} • ${browser}`
    };
};

/**
 * Extracts IP address and location metadata from request headers
 */
export const getRequestLocation = (req) => {
    if (!req) return { ip: '127.0.0.1', location: 'Local Network' };

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               req.headers['x-real-ip'] ||
               req.ip ||
               req.socket?.remoteAddress ||
               '127.0.0.1';

    // Check Cloudflare / Vercel Geo headers
    const city = req.headers['x-vercel-ip-city'] || req.headers['cf-ipcity'];
    const country = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'];
    const region = req.headers['x-vercel-ip-country-region'];

    let location = 'India (Default)';
    if (city && country) {
        location = `${city}, ${country}`;
    } else if (country) {
        location = country === 'IN' ? 'India' : country;
    } else if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        location = 'Local Host / Internal';
    } else {
        // Fallback friendly location for regional IPs
        location = 'Mumbai, India';
    }

    return { ip, location };
};
