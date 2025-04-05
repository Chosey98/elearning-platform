import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET - Get a specific course
export async function GET(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const course = await prisma.course.findUnique({
			where: {
				id: params.courseId,
			},
			include: {
				instructor: {
					select: {
						name: true,
						email: true,
					},
				},
				Week: {
					include: {
						topics: true,
					},
					orderBy: {
						week: 'asc',
					},
				},
			},
		});

		if (!course) {
			return NextResponse.json(
				{ error: 'Course not found' },
				{ status: 404 }
			);
		}

		// Parse JSON fields and structure weeks and topics
		const parsedCourse = {
			...course,
			syllabus: course.Week.map((week) => ({
				week: week.week,
				title: week.title,
				duration: week.duration,
				topics: week.topics.map((topic) => ({
					id: topic.id,
					title: topic.title,
					content: JSON.parse(topic.content),
				})),
			})),
			requirements: course.requirements
				? JSON.parse(course.requirements as string)
				: [],
			whatYouWillLearn: course.whatYouWillLearn
				? JSON.parse(course.whatYouWillLearn as string)
				: [],
		};

		return NextResponse.json(parsedCourse);
	} catch (error) {
		console.error('Error fetching course:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch course' },
			{ status: 500 }
		);
	}
}

// PUT - Update a course
export async function PUT(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		console.log('Session in PUT request:', session);

		if (!session?.user || session.user.role !== 'instructor') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Verify the instructor owns this course
		const existingCourse = await prisma.course.findUnique({
			where: {
				id: params.courseId,
			},
		});

		if (!existingCourse) {
			return NextResponse.json(
				{ error: 'Course not found' },
				{ status: 404 }
			);
		}

		if (existingCourse.instructorId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		const data = await request.json();
		console.log('Received update data:', data);

		// Prepare the update data
		const updateData = {
			title: data.title,
			description: data.description,
			fullDescription: data.fullDescription,
			level: data.level,
			category: data.category,
			duration: data.duration,
			price: data.price,
			imageUrl: data.imageUrl,
			language: data.language,
			syllabus: JSON.stringify(data.syllabus || []),
			requirements: JSON.stringify(data.requirements || []),
			whatYouWillLearn: JSON.stringify(data.whatYouWillLearn || []),
			lastUpdated: new Date().toISOString(),
		};

		// Update the course
		const updatedCourse = await prisma.course.update({
			where: {
				id: params.courseId,
			},
			data: updateData,
		});

		return NextResponse.json(updatedCourse);
	} catch (error) {
		console.error('Error updating course:', error);
		return NextResponse.json(
			{ error: 'Failed to update course' },
			{ status: 500 }
		);
	}
}

// DELETE - Delete a course
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user || session.user.role !== 'instructor') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		// Verify the instructor owns this course
		const course = await prisma.course.findUnique({
			where: {
				id: params.courseId,
			},
		});

		if (!course) {
			return NextResponse.json(
				{ error: 'Course not found' },
				{ status: 404 }
			);
		}

		if (course.instructorId !== session.user.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 403 }
			);
		}

		// Delete the course
		await prisma.course.delete({
			where: {
				id: params.courseId,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error deleting course:', error);
		return NextResponse.json(
			{ error: 'Failed to delete course' },
			{ status: 500 }
		);
	}
}
