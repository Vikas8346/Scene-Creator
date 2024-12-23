import { headers } from "next/headers";

/**
 * Get the correct URL for the environment
 * @returns {string} The full URL for the current environment
 */
export const getURL = (path = '') => {
    const headersList = headers();
    const host = headersList.get('host') || headersList.get('x-forwarded-host');

    const base = process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') ? 'http' : 'https';

    return `${base}://${host}${path}`;
};