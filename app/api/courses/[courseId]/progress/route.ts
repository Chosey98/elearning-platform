import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get progress for a course
export async function GET(
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

		const progress = await prisma.topicProgress.findMany({
			where: {
				userId: session.user.id,
				topic: {
					week: {
						courseId: params.courseId,
					},
				},
			},
		});

		return NextResponse.json(progress);
	} catch (error) {
		console.error('Error fetching progress:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch progress' },
			{ status: 500 }
		);
	}
}

// POST - Mark a topic as completed
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

		const { topicId, completed } = await request.json();

		const progress = await prisma.topicProgress.upsert({
			where: {
				userId_topicId: {
					userId: session.user.id,
					topicId: topicId,
				},
			},
			update: {
				completed,
			},
			create: {
				userId: session.user.id,
				topicId: topicId,
				completed: completed,
			},
		});

		return NextResponse.json(progress);
	} catch (error) {
		console.error('Error updating progress:', error);
		return NextResponse.json(
			{ error: 'Failed to update progress' },
			{ status: 500 }
		);
	}
}
