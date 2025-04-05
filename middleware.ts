import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define types for the user object in the token
interface User {
	id?: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role?: string;
}

interface Token {
	name?: string;
	email?: string;
	picture?: string;
	sub?: string;
	user?: User;
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	console.log('Middleware processing path:', pathname);

	// Get the token and user information
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	console.log('Token in middleware:', token);

	// Public routes that don't require authentication
	const publicRoutes = [
		'/',
		'/login',
		'/register',
		'/courses',
		'/housing',
		'/api/auth',
		'/api/register',
		'/api/housing',
	];

	// Check if the current route is public
	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);

	// If it's a public route, allow access
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// If the user is not authenticated and it's not a public route, redirect to login
	if (!token) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Handle role-based routing
	if (pathname.startsWith('/dashboard')) {
		// For the instructor dashboard
		if (
			pathname.startsWith('/dashboard/instructor') &&
			token.role !== 'instructor'
		) {
			console.log(
				'Access denied: Not an instructor, role is',
				token.role
			);
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}

		// For the homeowner dashboard
		if (
			pathname.startsWith('/dashboard/homeowner') &&
			token.role !== 'homeowner'
		) {
			console.log('Access denied: Not a homeowner, role is', token.role);
			return NextResponse.redirect(new URL('/dashboard', request.url));
		}

		// For the main dashboard, redirect to role-specific dashboard
		if (pathname === '/dashboard') {
			if (token.role === 'instructor') {
				return NextResponse.redirect(
					new URL('/dashboard/instructor', request.url)
				);
			} else if (token.role === 'homeowner') {
				return NextResponse.redirect(
					new URL('/dashboard/homeowner', request.url)
				);
			}
		}
	}

	// For all other authenticated routes, allow access
	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - uploads (uploaded files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|uploads).*)',
	],
};
