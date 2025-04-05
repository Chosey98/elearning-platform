import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get a specific house (public with private data for owner)
export async function GET(
	req: NextRequest,
	{ params }: { params: { houseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		const [house, rental, ratings] = await Promise.all([
			prisma.house.findUnique({
				where: {
					id: params.houseId,
				},
				include: {
					homeowner: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					rentals: {
						where: {
							status: 'active',
						},
						include: {
							renter: {
								select: {
									name: true,
									email: true,
								},
							},
						},
						take: 1,
						orderBy: {
							startDate: 'desc',
						},
					},
				},
			}),
			session?.user?.id
				? prisma.rental.findFirst({
						where: {
							renterId: session.user.id,
							houseId: params.houseId,
							status: 'completed',
						},
				  })
				: null,
			prisma.houseRating.findMany({
				where: {
					houseId: params.houseId,
				},
			}),
		]);

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		// Parse JSON strings back to arrays
		const amenities =
			typeof house.amenities === 'string'
				? JSON.parse(house.amenities)
				: house.amenities;
		const images =
			typeof house.images === 'string'
				? JSON.parse(house.images)
				: house.images;

		// Get current rental if exists
		const currentRental = house.rentals[0];

		const publicHouse = {
			...house,
			amenities,
			images,
			homeownerId: house.homeownerId,
			currentRental: currentRental
				? {
						id: currentRental.id,
						startDate: currentRental.startDate,
						endDate: currentRental.endDate,
						renter: currentRental.renter,
				  }
				: null,
		};

		// Calculate average rating
		const averageRating =
			ratings.length > 0
				? ratings.reduce((acc, curr) => acc + curr.rating, 0) /
				  ratings.length
				: 0;

		return NextResponse.json({
			...publicHouse,
			hasRented: !!rental,
			rating: averageRating,
			reviewsCount: ratings.length,
		});
	} catch (error) {
		console.error('Error in GET /api/housing/[houseId]:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// PUT - Update a house (authenticated, homeowner only)
export async function PUT(
	req: NextRequest,
	{ params }: { params: { houseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		if (house.homeownerId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const data = await req.json();
		const {
			homeownerId,
			currentRentalId,
			userId,
			homeowner,
			currentRental,
			rentals,
			...updateData
		} = data;

		// Convert arrays to JSON strings for storage
		const updatedHouse = await prisma.house.update({
			where: {
				id: params.houseId,
			},
			data: {
				...updateData,
				amenities: JSON.stringify(updateData.amenities || []),
				images: JSON.stringify(updateData.images || []),
			},
		});

		// Parse JSON strings back to arrays in response
		return NextResponse.json({
			...updatedHouse,
			amenities: JSON.parse(updatedHouse.amenities),
			images: JSON.parse(updatedHouse.images),
		});
	} catch (error) {
		console.error('Error updating house:', error);
		return NextResponse.json(
			{ error: 'Failed to update house' },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a house (authenticated, homeowner only)
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { houseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const house = await prisma.house.findUnique({
			where: {
				id: params.houseId,
			},
			select: {
				homeownerId: true,
			},
		});

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		if (house.homeownerId !== session.user.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await prisma.house.delete({
			where: {
				id: params.houseId,
			},
		});

		return NextResponse.json({ message: 'House deleted successfully' });
	} catch (error) {
		console.error('Error deleting house:', error);
		return NextResponse.json(
			{ error: 'Failed to delete house' },
			{ status: 500 }
		);
	}
}
