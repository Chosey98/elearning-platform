import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Check if house is favorited
export async function GET(
	request: NextRequest,
	{ params }: { params: { houseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ isFavorited: false });
		}

		const favorite = await prisma.houseFavorite.findUnique({
			where: {
				userId_houseId: {
					userId: session.user.id,
					houseId: params.houseId,
				},
			},
		});

		return NextResponse.json({ isFavorited: !!favorite });
	} catch (error) {
		console.error('Error checking favorite status:', error);
		return NextResponse.json(
			{ error: 'Failed to check favorite status' },
			{ status: 500 }
		);
	}
}

// POST - Toggle favorite status
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

		const favorite = await prisma.houseFavorite.findUnique({
			where: {
				userId_houseId: {
					userId: session.user.id,
					houseId: params.houseId,
				},
			},
		});

		if (favorite) {
			// Remove favorite
			await prisma.houseFavorite.delete({
				where: {
					id: favorite.id,
				},
			});
			return NextResponse.json({ isFavorited: false });
		} else {
			// Add favorite
			await prisma.houseFavorite.create({
				data: {
					userId: session.user.id,
					houseId: params.houseId,
				},
			});
			return NextResponse.json({ isFavorited: true });
		}
	} catch (error) {
		console.error('Error toggling favorite status:', error);
		return NextResponse.json(
			{ error: 'Failed to update favorite status' },
			{ status: 500 }
		);
	}
}
