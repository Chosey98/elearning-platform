import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get all housing listings (public)
export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		const houses = await prisma.house.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				address: true,
				price: true,
				bedrooms: true,
				bathrooms: true,
				size: true,
				amenities: true,
				images: true,
				status: true,
				type: true,
				homeownerId: true,
				homeowner: {
					select: {
						name: true,
					},
				},
				rentals: {
					where: {
						endDate: {
							gt: new Date(),
						},
					},
					select: {
						id: true,
						startDate: true,
						endDate: true,
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
			orderBy: {
				createdAt: 'desc',
			},
		});

		// Parse JSON strings back to arrays and filter out rented houses for non-owners
		const parsedHouses = houses
			.map((house) => {
				try {
					const hasActiveRental =
						house.rentals && house.rentals.length > 0;
					return {
						...house,
						amenities: JSON.parse(house.amenities || '[]'),
						images: JSON.parse(house.images || '[]'),
						status: hasActiveRental ? 'rented' : house.status,
						rentals: undefined, // Remove rentals from public API
					};
				} catch (error) {
					console.error('Error parsing house data:', error);
					return {
						...house,
						amenities: [],
						images: [],
						rentals: undefined,
					};
				}
			})
			.filter((house) => {
				// Show all properties to the homeowner, but only available ones to others
				if (session?.user?.id === house.homeownerId) {
					return true;
				}
				return house.status === 'available';
			});

		return NextResponse.json({ houses: parsedHouses });
	} catch (error) {
		console.error('Error fetching houses:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch houses' },
			{ status: 500 }
		);
	}
}

// POST - Create a new housing listing (authenticated)
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const data = await request.json();
		console.log('Received housing data:', data);

		// Convert string values to numbers
		const price = parseFloat(data.price);
		const bedrooms = parseInt(data.bedrooms, 10);
		const bathrooms = parseInt(data.bathrooms, 10);
		const size = parseFloat(data.size);

		// Validate numeric values
		if (
			isNaN(price) ||
			isNaN(bedrooms) ||
			isNaN(bathrooms) ||
			isNaN(size)
		) {
			return NextResponse.json(
				{
					error: 'Invalid input',
					details:
						'Price, bedrooms, bathrooms, and size must be valid numbers',
				},
				{ status: 400 }
			);
		}

		// Ensure images is an array
		const imageUrls = Array.isArray(data.images) ? data.images : [];
		const amenitiesList = Array.isArray(data.amenities)
			? data.amenities
			: [];

		// Create house listing
		const house = await prisma.house.create({
			data: {
				title: data.title,
				description: data.description,
				address: data.address,
				price,
				bedrooms,
				bathrooms,
				size,
				amenities: JSON.stringify(amenitiesList),
				images: JSON.stringify(imageUrls),
				status: 'available',
				type: data.type || 'apartment',
				homeownerId: session.user.id,
			},
		});

		// Parse JSON strings back to arrays in response
		const parsedHouse = {
			...house,
			amenities: JSON.parse(house.amenities),
			images: JSON.parse(house.images),
		};

		return NextResponse.json(parsedHouse);
	} catch (error: any) {
		console.error('Error creating house listing:', error);
		return NextResponse.json(
			{
				error: 'Failed to create house listing',
				details: error?.message || 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
