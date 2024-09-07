import { NextResponse } from 'next/server';

export function middleware(req) {
    // Get cookies from the request headers
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? parseCookies(cookieHeader) : {};

    const token = cookies.token; // Adjust this if your token is stored under a different key

    console.log('Cookies:', cookies); // Debugging: Log all cookies
    console.log('Token:', token); // Debugging: Log the token

    if (token) {
        // Allow access if token is present
        return NextResponse.next();
    } else {
        // Redirect to the login page if token is not present
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Helper function to parse cookies from the cookie header
function parseCookies(cookieHeader) {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (name && value) {
            cookies[name.trim()] = value.trim();
        }
    });
    return cookies;
}

export const config = {
    matcher: '/', // Adjust this to match the paths you want to protect
};
