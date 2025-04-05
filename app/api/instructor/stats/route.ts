import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id || session.user.role !== 'instructor') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Get all courses by the instructor
		const courses = await prisma.course.findMany({
			where: {
				instructorId: session.user.id,
			},
			include: {
				enrollments: true,
			},
		});

		// Calculate total students (unique students across all courses)
		const uniqueStudentIds = new Set();
		let totalRevenue = 0;

		courses.forEach((course) => {
			// Add student IDs to set
			course.enrollments.forEach((enrollment) => {
				uniqueStudentIds.add(enrollment.userId);
			});

			// Calculate revenue (price * number of enrollments)
			const price = parseFloat(course.price);
			if (!isNaN(price)) {
				totalRevenue += price * course.enrollments.length;
			}
		});

		// Get total number of courses
		const totalCourses = courses.length;

		// Get total number of unique students
		const totalStudents = uniqueStudentIds.size;

		// Calculate average rating (if you have a rating system)
		const averageRating = 0; // Implement this when you add a rating system

		return NextResponse.json({
			totalCourses,
			totalStudents,
			totalRevenue,
			averageRating,
		});
	} catch (error) {
		console.error('Error fetching instructor stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch instructor stats' },
			{ status: 500 }
		);
	}
}
