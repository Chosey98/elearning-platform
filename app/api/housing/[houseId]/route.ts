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
		const house = await prisma.house.findUnique({
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
				rentals: true,
				currentRental: true,
			},
		});

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		// Parse JSON strings back to arrays
		const parsedHouse = {
			...house,
			amenities: JSON.parse(house.amenities),
			images: JSON.parse(house.images),
			latitude: house.latitude || undefined,
			longitude: house.longitude || undefined,
		};

		// If user is not authenticated or not the homeowner, remove sensitive information
		type PublicHouse = Omit<
			typeof parsedHouse,
			'rentals' | 'currentRental' | 'homeowner'
		> & {
			rentals?: typeof parsedHouse.rentals;
			currentRental?: typeof parsedHouse.currentRental;
			homeowner: Omit<typeof parsedHouse.homeowner, 'email'> & {
				email?: string | null;
			};
		};

		const publicHouse: PublicHouse = { ...parsedHouse };
		if (!session?.user || house.homeownerId !== session.user.id) {
			delete publicHouse.rentals;
			delete publicHouse.currentRental;
			delete publicHouse.homeowner.email;
		}

		return NextResponse.json(publicHouse);
	} catch (error) {
		console.error('Error fetching house:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch house' },
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
