import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		console.log('Session in enrollment check:', session);
		console.log('Course ID:', params.courseId);

		if (!session?.user?.id) {
			console.log('No user ID in session for enrollment check');
			return NextResponse.json({ isEnrolled: false });
		}

		console.log('Checking enrollment for user:', session.user.id);

		// Check if user is enrolled in the course using the unique constraint
		const enrollment = await prisma.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
				},
			},
		});

		console.log('Found enrollment:', enrollment);

		const isEnrolled = !!enrollment;
		console.log('Is enrolled:', isEnrolled);

		return NextResponse.json({
			isEnrolled,
			userId: session.user.id,
			courseId: params.courseId,
		});
	} catch (error) {
		console.error('Error checking enrollment:', error);
		return NextResponse.json(
			{ error: 'Failed to check enrollment status' },
			{ status: 500 }
		);
	}
}
