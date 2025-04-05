import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, password, phone, nationality, role } = body;

		// Validate required fields
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phone,
				nationality,
				role: role || 'student',
			},
		});

		// Remove password from response
		const { password: _, ...userWithoutPassword } = user;

		return NextResponse.json(userWithoutPassword, { status: 201 });
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ error: 'Error creating user' },
			{ status: 500 }
		);
	}
}
