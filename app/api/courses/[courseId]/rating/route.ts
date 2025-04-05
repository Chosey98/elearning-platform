import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get course rating and all reviews
export async function GET(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const ratings = await prisma.courseRating.findMany({
			where: {
				courseId: params.courseId,
			},
			include: {
				user: {
					select: {
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Calculate average rating
		const averageRating =
			ratings.length > 0
				? ratings.reduce((acc, curr) => acc + curr.rating, 0) /
				  ratings.length
				: 0;

		return NextResponse.json({
			ratings,
			averageRating,
			totalRatings: ratings.length,
		});
	} catch (error) {
		console.error('Error fetching course ratings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch course ratings' },
			{ status: 500 }
		);
	}
}

// POST - Add or update course rating
export async function POST(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { rating, comment } = await request.json();

		// Validate rating
		if (typeof rating !== 'number' || rating < 1 || rating > 5) {
			return NextResponse.json(
				{ error: 'Rating must be a number between 1 and 5' },
				{ status: 400 }
			);
		}

		// Check if user is enrolled in the course
		const enrollment = await prisma.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
				},
			},
		});

		if (!enrollment) {
			return NextResponse.json(
				{ error: 'You must be enrolled in the course to rate it' },
				{ status: 403 }
			);
		}

		// Upsert the rating
		const courseRating = await prisma.courseRating.upsert({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
				},
			},
			update: {
				rating,
				comment,
			},
			create: {
				userId: session.user.id,
				courseId: params.courseId,
				rating,
				comment,
			},
		});

		return NextResponse.json(courseRating);
	} catch (error) {
		console.error('Error updating course rating:', error);
		return NextResponse.json(
			{ error: 'Failed to update course rating' },
			{ status: 500 }
		);
	}
}
