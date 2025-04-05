import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const [enrollments, favorites, rentals, houseFavorites] =
			await Promise.all([
				prisma.enrollment.findMany({
					where: {
						userId: session.user.id,
					},
					include: {
						course: {
							select: {
								id: true,
								title: true,
								description: true,
								imageUrl: true,
								instructor: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
				prisma.favorite.findMany({
					where: {
						userId: session.user.id,
					},
					include: {
						course: {
							select: {
								id: true,
								title: true,
								description: true,
								imageUrl: true,
								instructor: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
				prisma.rental.findMany({
					where: {
						renterId: session.user.id,
						status: 'active',
					},
					include: {
						house: {
							select: {
								id: true,
								title: true,
								description: true,
								address: true,
								price: true,
								images: true,
								homeowner: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
				prisma.houseFavorite.findMany({
					where: {
						userId: session.user.id,
					},
					include: {
						house: {
							select: {
								id: true,
								title: true,
								description: true,
								address: true,
								price: true,
								images: true,
								homeowner: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				}),
			]);

		// Helper function to safely parse JSON
		const safeJsonParse = (str: string) => {
			try {
				return JSON.parse(str);
			} catch (e) {
				return [];
			}
		};

		return NextResponse.json({
			enrolledCourses: enrollments.map((e) => e.course),
			favoriteCourses: favorites.map((f) => f.course),
			rentedHouses: rentals.map((r) => ({
				...r.house,
				images: safeJsonParse(r.house.images as string),
				startDate: r.startDate,
				endDate: r.endDate,
			})),
			favoriteHouses: houseFavorites.map((f) => ({
				...f.house,
				images: safeJsonParse(f.house.images as string),
			})),
			totalEnrolled: enrollments.length,
			totalFavorites: favorites.length,
			totalRented: rentals.length,
			totalFavoriteHouses: houseFavorites.length,
		});
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user stats' },
			{ status: 500 }
		);
	}
}
