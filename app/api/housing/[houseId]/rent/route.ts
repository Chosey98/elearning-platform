import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(
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

		const body = await req.json();
		const { startDate, endDate } = body;

		// Validate required fields
		if (!startDate) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Check if house exists and is available
		const house = await prisma.house.findUnique({
			where: {
				id: params.houseId,
			},
			include: {
				currentRental: true,
			},
		});

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		if (house.status !== 'available') {
			return NextResponse.json(
				{ error: 'House is not available for rent' },
				{ status: 400 }
			);
		}

		// Create rental
		const rental = await prisma.rental.create({
			data: {
				startDate: new Date(startDate),
				endDate: endDate ? new Date(endDate) : null,
				houseId: params.houseId,
				renterId: session.user.id,
			},
		});

		// Update house status and current rental
		await prisma.house.update({
			where: {
				id: params.houseId,
			},
			data: {
				status: 'rented',
				currentRentalId: rental.id,
			},
		});

		return NextResponse.json(rental);
	} catch (error) {
		console.error('Error creating rental:', error);
		return NextResponse.json(
			{ error: 'Failed to create rental' },
			{ status: 500 }
		);
	}
}

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

		// Check if house exists and has a current rental
		const house = await prisma.house.findUnique({
			where: {
				id: params.houseId,
			},
			include: {
				currentRental: true,
			},
		});

		if (!house) {
			return NextResponse.json(
				{ error: 'House not found' },
				{ status: 404 }
			);
		}

		if (!house.currentRental) {
			return NextResponse.json(
				{ error: 'No active rental found' },
				{ status: 400 }
			);
		}

		// End the rental
		await prisma.rental.update({
			where: {
				id: house.currentRental.id,
			},
			data: {
				status: 'completed',
				endDate: new Date(),
			},
		});

		// Update house status
		await prisma.house.update({
			where: {
				id: params.houseId,
			},
			data: {
				status: 'available',
				currentRentalId: null,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error ending rental:', error);
		return NextResponse.json(
			{ error: 'Failed to end rental' },
			{ status: 500 }
		);
	}
}
