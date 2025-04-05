import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
	try {
		// Count users
		const userCount = await prisma.user.count();

		// Get user emails (without sensitive data)
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
			},
		});

		return NextResponse.json({
			message: 'Debug information',
			userCount,
			users,
		});
	} catch (error) {
		console.error('Debug error:', error);
		return NextResponse.json(
			{ error: 'Error fetching debug info' },
			{ status: 500 }
		);
	}
}
