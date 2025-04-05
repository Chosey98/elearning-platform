import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Check if course is favorited
export async function GET(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ isFavorited: false });
		}

		const favorite = await prisma.favorite.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
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

		const favorite = await prisma.favorite.findUnique({
			where: {
				userId_courseId: {
					userId: session.user.id,
					courseId: params.courseId,
				},
			},
		});

		if (favorite) {
			// Remove favorite
			await prisma.favorite.delete({
				where: {
					id: favorite.id,
				},
			});
			return NextResponse.json({ isFavorited: false });
		} else {
			// Add favorite
			await prisma.favorite.create({
				data: {
					userId: session.user.id,
					courseId: params.courseId,
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
