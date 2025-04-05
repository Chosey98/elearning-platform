import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		console.log('Session in enrollment request:', session);
		console.log('Course ID:', params.courseId);

		if (!session?.user?.id) {
			console.log('No user ID in session');
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		console.log('User ID:', session.user.id);

		// Check if the course exists
		const course = await prisma.course.findUnique({
			where: {
				id: params.courseId,
			},
		});

		console.log('Found course:', course);

		if (!course) {
			return NextResponse.json(
				{ error: 'Course not found' },
				{ status: 404 }
			);
		}

		// Check if user is already enrolled using the unique constraint
		const existingEnrollment = await prisma.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
				},
			},
		});

		console.log('Existing enrollment:', existingEnrollment);

		if (existingEnrollment) {
			return NextResponse.json(
				{ error: 'Already enrolled in this course' },
				{ status: 400 }
			);
		}

		// Create enrollment
		console.log('Creating new enrollment...');
		const enrollment = await prisma.enrollment.create({
			data: {
				userId: session.user.id,
				courseId: params.courseId,
			},
			include: {
				course: true,
			},
		});

		console.log('Created enrollment:', enrollment);

		return NextResponse.json({
			message: `Successfully enrolled in ${course.title}`,
			enrollment,
			userId: session.user.id,
			courseId: params.courseId,
		});
	} catch (error) {
		console.error('Error enrolling in course:', error);
		return NextResponse.json(
			{ error: 'Failed to enroll in course' },
			{ status: 500 }
		);
	}
}
