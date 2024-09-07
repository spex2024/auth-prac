import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value; // Use the Next.js cookies API

    console.log('Token:', token); // Debugging: Log the token

    if (token) {
        // Allow access if token is present
        return NextResponse.next();
    } else {
        // Redirect to the login page if token is not present
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/', '/home', '/dashboard', '/profile'], // Adjust paths to match the routes you want to protect
};
