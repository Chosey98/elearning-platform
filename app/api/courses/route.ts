import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

// GET - Get all courses
export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession();
		console.log('API - Session data:', JSON.stringify(session, null, 2));

		const searchParams = new URL(request.url).searchParams;
		const isInstructor = session?.user?.role === 'instructor';
		console.log('API - Is instructor:', isInstructor);

		// If authenticated as instructor, fetch their courses
		if (isInstructor && session?.user?.id) {
			console.log(
				'API - Fetching courses for instructor:',
				session.user.id
			);

			// Debug the database query
			try {
				const courses = await prisma.course.findMany({
					where: {
						instructorId: session.user.id,
					},
					include: {
						instructor: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				});

				console.log(
					'API - Raw database response:',
					JSON.stringify(courses, null, 2)
				);

				// Parse JSON fields
				const parsedCourses = courses.map((course) => {
					try {
						return {
							...course,
							syllabus: course.syllabus
								? JSON.parse(course.syllabus as string)
								: [],
							requirements: course.requirements
								? JSON.parse(course.requirements as string)
								: [],
							whatYouWillLearn: course.whatYouWillLearn
								? JSON.parse(course.whatYouWillLearn as string)
								: [],
						};
					} catch (parseError) {
						console.error(
							'API - Error parsing course JSON fields:',
							parseError
						);
						return course;
					}
				});

				console.log(
					'API - Sending parsed courses:',
					JSON.stringify(parsedCourses, null, 2)
				);
				return NextResponse.json(parsedCourses);
			} catch (dbError) {
				console.error('API - Database query error:', dbError);
				throw dbError;
			}
		}

		// For public access, return all courses
		console.log('API - Fetching all courses (public access)');
		const courses = await prisma.course.findMany({
			include: {
				instructor: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});

		// Parse JSON fields
		const parsedCourses = courses.map((course) => {
			try {
				return {
					...course,
					syllabus: course.syllabus
						? JSON.parse(course.syllabus as string)
						: [],
					requirements: course.requirements
						? JSON.parse(course.requirements as string)
						: [],
					whatYouWillLearn: course.whatYouWillLearn
						? JSON.parse(course.whatYouWillLearn as string)
						: [],
				};
			} catch (parseError) {
				console.error(
					'API - Error parsing course JSON fields:',
					parseError
				);
				return course;
			}
		});

		console.log(
			'API - Sending all courses:',
			JSON.stringify(parsedCourses, null, 2)
		);
		return NextResponse.json(parsedCourses);
	} catch (error) {
		console.error('API - Error fetching courses:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch courses', details: error },
			{ status: 500 }
		);
	}
}

// POST - Create a new course (instructors only)
export async function POST(request: NextRequest) {
	try {
		const token = await getToken({ req: request });
		console.log('Token in middleware:', JSON.stringify(token, null, 2));

		if (!token?.sub || token.role !== 'instructor') {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const data = await request.json();
		console.log('Received course data:', JSON.stringify(data, null, 2));

		// Create course with weeks and topics
		const course = await prisma.course.create({
			data: {
				title: data.title,
				description: data.description,
				fullDescription: data.fullDescription || '',
				level: data.level,
				category: data.category,
				duration: data.duration,
				price: data.price,
				imageUrl: data.imageUrl,
				language: data.language || 'English',
				syllabus: JSON.stringify(data.syllabus || []),
				requirements: JSON.stringify(data.requirements || []),
				whatYouWillLearn: JSON.stringify(data.whatYouWillLearn || []),
				instructorId: token.sub,
				Week: {
					create: (data.syllabus || []).map((week: any) => ({
						week: week.week,
						title: week.title,
						duration: week.duration,
						topics: {
							create: week.topics.map((topic: any) => ({
								title: topic.title,
								content: JSON.stringify(topic.content || []),
							})),
						},
					})),
				},
			},
			include: {
				Week: {
					include: {
						topics: true,
					},
				},
			},
		});

		console.log('Created course:', JSON.stringify(course, null, 2));
		return NextResponse.json(course);
	} catch (error: any) {
		console.error('Detailed error creating course:', {
			name: error?.name || 'Unknown error',
			message: error?.message || 'No error message',
			stack: error?.stack || 'No stack trace',
		});

		return NextResponse.json(
			{
				error: 'Failed to create course',
				details: error?.message || 'Unknown error',
			},
			{ status: 500 }
		);
	}
}
