import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Get all houses for the homeowner
		const houses = await prisma.house.findMany({
			where: {
				homeownerId: session.user.id,
			},
			include: {
				currentRental: {
					include: {
						renter: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		// Calculate statistics
		const totalHouses = houses.length;
		const activeRentals = houses.filter(
			(h) => h.status === 'rented'
		).length;
		const totalRevenue = houses.reduce((sum, house) => {
			return sum + (house.currentRental ? house.price : 0);
		}, 0);

		// Format houses for response
		const formattedHouses = houses.map((house) => ({
			id: house.id,
			title: house.title,
			description: house.description,
			address: house.address,
			price: house.price,
			imageUrl: house.imageUrl,
			status: house.status,
			currentRenter: house.currentRental?.renter,
		}));

		return NextResponse.json({
			totalHouses,
			activeRentals,
			totalRevenue,
			houses: formattedHouses,
		});
	} catch (error) {
		console.error('Error fetching homeowner stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch homeowner statistics' },
			{ status: 500 }
		);
	}
}
