import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get house rating and all reviews
export async function GET(
	request: NextRequest,
	{ params }: { params: { houseId: string } }
) {
	try {
		const ratings = await prisma.houseRating.findMany({
			where: {
				houseId: params.houseId,
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
				? ratings.reduce(
						(acc: number, curr: { rating: number }) =>
							acc + curr.rating,
						0
				  ) / ratings.length
				: 0;

		return NextResponse.json({
			ratings,
			averageRating,
			totalRatings: ratings.length,
		});
	} catch (error) {
		console.error('Error fetching house ratings:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch house ratings' },
			{ status: 500 }
		);
	}
}

// POST - Add or update house rating
export async function POST(
	request: NextRequest,
	{ params }: { params: { houseId: string } }
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

		// Check if user has completed a rental for this house
		const rental = await prisma.rental.findFirst({
			where: {
				renterId: session.user.id,
				houseId: params.houseId,
				status: 'completed',
			},
		});

		if (!rental) {
			return NextResponse.json(
				{
					error: 'You must have completed a rental to rate this property',
				},
				{ status: 403 }
			);
		}

		// Upsert the rating
		const houseRating = await prisma.houseRating.upsert({
			where: {
				userId_houseId: {
					userId: session.user.id,
					houseId: params.houseId,
				},
			},
			update: {
				rating,
				comment,
			},
			create: {
				userId: session.user.id,
				houseId: params.houseId,
				rating,
				comment,
			},
		});

		return NextResponse.json(houseRating);
	} catch (error) {
		console.error('Error updating house rating:', error);
		return NextResponse.json(
			{ error: 'Failed to update house rating' },
			{ status: 500 }
		);
	}
}
