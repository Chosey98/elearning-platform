'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Calendar,
	ArrowLeft,
	Heart,
	Share,
	CheckCircle,
	GraduationCap,
	Clock,
	User,
	BookOpen,
	Star,
	Circle,
	File,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Rating } from '@/components/ui/rating';

interface Course {
	id: string;
	title: string;
	description: string;
	fullDescription: string;
	level: string;
	category: string;
	duration: string;
	price: string;
	imageUrl: string | null;
	syllabus: Week[];
	requirements: string[];
	whatYouWillLearn: string[];
	instructorId: string;
	lastUpdated: string;
	language: string;
	instructor: {
		name: string;
		email: string;
	};
	// Additional fields for UI
	rating?: number;
	reviewsCount?: number;
	studentsCount?: number;
	color?: string;
	images?: string[];
	isEnrolled?: boolean;
}

interface Week {
	week: number;
	title: string;
	topics: Topic[];
	duration: string;
}

interface Topic {
	id: string;
	title: string;
	content: TopicContent[];
	completed?: boolean;
}

interface TopicContent {
	type: 'video' | 'file';
	title: string;
	url: string;
	fileType?: string;
	duration?: string;
}

export default function CourseDetailPage({
	params,
}: {
	params: { courseId: string };
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [enrolling, setEnrolling] = useState(false);
	const [message, setMessage] = useState<string>('');
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState<Record<string, boolean>>({});
	const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
	const [contentLoading, setContentLoading] = useState(false);
	const [isFavorited, setIsFavorited] = useState(false);

	// Check enrollment status
	const checkEnrollmentStatus = async () => {
		try {
			console.log('Client: Checking enrollment status...');
			const enrollmentResponse = await fetch(
				`/api/courses/${params.courseId}/enrollment`
			);
			console.log(
				'Client: Enrollment response status:',
				enrollmentResponse.status
			);

			if (enrollmentResponse.ok) {
				const enrollmentData = await enrollmentResponse.json();
				console.log('Client: Enrollment data:', enrollmentData);
				return enrollmentData.isEnrolled;
			} else {
				console.error(
					'Client: Failed to check enrollment status:',
					await enrollmentResponse.text()
				);
				return false;
			}
		} catch (error) {
			console.error('Client: Error checking enrollment status:', error);
			return false;
		}
	};

	// Check favorite status
	useEffect(() => {
		const checkFavoriteStatus = async () => {
			try {
				const response = await fetch(
					`/api/courses/${params.courseId}/favorite`
				);
				if (response.ok) {
					const data = await response.json();
					setIsFavorited(data.isFavorited);
				}
			} catch (error) {
				console.error('Error checking favorite status:', error);
			}
		};

		checkFavoriteStatus();
	}, [params.courseId]);

	useEffect(() => {
		const fetchCourse = async () => {
			try {
				console.log(
					'Client: Starting course fetch for ID:',
					params.courseId
				);
				const response = await fetch(`/api/courses/${params.courseId}`);
				console.log('Client: Response status:', response.status);

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					console.error('Client: Error response:', errorData);
					throw new Error(
						errorData.details ||
							`Failed to fetch course: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();
				console.log('Client: Received course data:', data);

				// Parse JSON strings if they haven't been parsed already
				console.log('Client: Parsing course data...');
				const parsedData = {
					...data,
					syllabus:
						typeof data.syllabus === 'string'
							? JSON.parse(data.syllabus)
							: data.syllabus,
					requirements:
						typeof data.requirements === 'string'
							? JSON.parse(data.requirements)
							: data.requirements,
					whatYouWillLearn:
						typeof data.whatYouWillLearn === 'string'
							? JSON.parse(data.whatYouWillLearn)
							: data.whatYouWillLearn,
				};
				console.log('Client: Successfully parsed course data');

				// Check enrollment status
				const isEnrolled = await checkEnrollmentStatus();
				parsedData.isEnrolled = isEnrolled;
				console.log(
					'Client: Updated course data with enrollment status:',
					isEnrolled
				);

				setCourse(parsedData);
			} catch (error) {
				console.error('Client: Error in course fetch:', error);
				toast({
					title: 'Error',
					description:
						error instanceof Error
							? error.message
							: 'Failed to load course details',
					variant: 'destructive',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [params.courseId, toast]);

	// Check URL parameters for payment success
	useEffect(() => {
		const handlePaymentSuccess = async () => {
			const searchParams = new URLSearchParams(window.location.search);
			const success = searchParams.get('success');
			const courseId = searchParams.get('courseId');

			console.log('Payment success check:', {
				success,
				courseId,
				paramsCourseId: params.courseId,
			});

			if (success === 'true' && courseId === params.courseId) {
				try {
					console.log('Attempting to enroll after payment...');
					const response = await fetch(
						`/api/courses/${params.courseId}/enroll`,
						{
							method: 'POST',
						}
					);

					console.log('Enrollment response status:', response.status);
					const responseData = await response.json();
					console.log('Enrollment response:', responseData);

					if (!response.ok) {
						throw new Error(
							responseData.error || 'Failed to enroll in course'
						);
					}

					toast({
						title: 'Success',
						description: responseData.message,
					});

					// Check enrollment status and update course data
					const isEnrolled = await checkEnrollmentStatus();
					setCourse((prev) =>
						prev ? { ...prev, isEnrolled } : null
					);

					// Remove query parameters and refresh the page
					window.location.href = `/courses/${params.courseId}`;
				} catch (error) {
					console.error('Error in payment success handler:', error);
					toast({
						title: 'Error',
						description:
							error instanceof Error
								? error.message
								: 'Failed to enroll in course',
						variant: 'destructive',
					});
				}
			}
		};

		handlePaymentSuccess();
	}, [params.courseId, toast]);

	// Fetch progress
	useEffect(() => {
		const fetchProgress = async () => {
			try {
				const response = await fetch(
					`/api/courses/${params.courseId}/progress`
				);
				if (response.ok) {
					const data = await response.json();
					const progressMap = data.reduce(
						(acc: Record<string, boolean>, item: any) => {
							acc[item.topicId] = item.completed;
							return acc;
						},
						{}
					);
					setProgress(progressMap);
				}
			} catch (error) {
				console.error('Error fetching progress:', error);
			}
		};

		if (course?.isEnrolled) {
			fetchProgress();
		}
	}, [course?.isEnrolled, params.courseId]);

	// Handle topic completion
	const handleTopicCompletion = async (
		topicId: string,
		completed: boolean
	) => {
		try {
			const response = await fetch(
				`/api/courses/${params.courseId}/progress`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ topicId, completed }),
				}
			);

			if (response.ok) {
				setProgress((prev) => ({
					...prev,
					[topicId]: completed,
				}));
				toast({
					title: completed ? 'Topic Completed' : 'Topic Uncompleted',
					description: completed
						? 'Great job! Keep going!'
						: 'Progress updated',
				});
			}
		} catch (error) {
			console.error('Error updating progress:', error);
			toast({
				title: 'Error',
				description: 'Failed to update progress',
				variant: 'destructive',
			});
		}
	};

	// Calculate overall progress
	const calculateProgress = () => {
		if (!course?.syllabus) return 0;
		const totalTopics = course.syllabus.reduce(
			(total, week) => total + week.topics.length,
			0
		);
		const completedTopics = Object.values(progress).filter(Boolean).length;
		return (completedTopics / totalTopics) * 100;
	};

	// Handle favorite toggle
	const handleFavoriteToggle = async () => {
		try {
			const response = await fetch(
				`/api/courses/${params.courseId}/favorite`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update favorite status');
			}

			const data = await response.json();
			setIsFavorited(data.isFavorited);
			toast({
				title: data.isFavorited
					? 'Added to Favorites'
					: 'Removed from Favorites',
				description: data.isFavorited
					? 'This course has been added to your favorites.'
					: 'This course has been removed from your favorites.',
			});
		} catch (error) {
			console.error('Error toggling favorite status:', error);
			toast({
				title: 'Error',
				description: 'Failed to update favorite status',
				variant: 'destructive',
			});
		}
	};

	// Handle share
	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({
					title: course?.title || 'Course',
					text: course?.description || '',
					url: window.location.href,
				});
				toast({
					title: 'Shared Successfully',
					description: 'Course has been shared.',
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
				toast({
					title: 'Link Copied',
					description: 'Course link has been copied to clipboard.',
				});
			}
		} catch (error) {
			console.error('Error sharing course:', error);
			// Always try to fall back to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
				toast({
					title: 'Link Copied',
					description: 'Course link has been copied to clipboard.',
				});
			} catch (clipboardError) {
				toast({
					title: 'Error',
					description: 'Failed to share or copy course link.',
					variant: 'destructive',
				});
			}
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Course Not Found
					</h1>
					<Button onClick={() => router.push('/courses')}>
						Back to Courses
					</Button>
				</div>
			</div>
		);
	}

	const handleEnroll = () => {
		setEnrolling(true);
		// Redirect to payment page with course details
		router.push(
			`/payment?type=course&id=${course?.id}&title=${encodeURIComponent(
				course?.title || ''
			)}&amount=${course?.price}&returnUrl=${encodeURIComponent(
				`/courses/${course?.id}?success=true&courseId=${course?.id}`
			)}`
		);
	};

	const handleSaveCourse = () => {
		toast({
			title: 'Course Saved',
			description: 'This course has been added to your wishlist',
		});
	};

	const handleContactInstructor = () => {
		if (!message) {
			toast({
				title: 'Please add a message',
				description: 'You need to write a message to the instructor',
				variant: 'destructive',
			});
			return;
		}

		toast({
			title: 'Message Sent',
			description:
				"Your message has been sent to the instructor. They'll get back to you soon.",
		});

		setMessage('');
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container mx-auto py-8 px-4">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to courses
					</Button>

					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold gradient-text">
								{course.title}
							</h1>
							<Rating
								type="course"
								itemId={course.id}
								canRate={course.isEnrolled}
								className="mt-2"
							/>
							<div className="flex items-center text-muted-foreground mt-1">
								<span className="flex items-center">
									<Star className="h-4 w-4 text-yellow-400 mr-1" />{' '}
									{course.rating}
								</span>
								<span className="mx-2">•</span>
								<span>{course.reviewsCount} reviews</span>
								<span className="mx-2">•</span>
								<span>{course.studentsCount} students</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={handleFavoriteToggle}
								className={`border-primary/20 hover:bg-primary/5 ${
									isFavorited ? 'text-red-500' : ''
								}`}
							>
								<Heart
									className={`mr-2 h-4 w-4 ${
										isFavorited ? 'fill-current' : ''
									}`}
								/>{' '}
								{isFavorited ? 'Favorited' : 'Favorite'}
							</Button>
							<Button
								variant="outline"
								onClick={handleShare}
								className="border-primary/20 hover:bg-primary/5"
							>
								<Share className="mr-2 h-4 w-4" /> Share
							</Button>
						</div>
					</div>
				</div>

				{/* Course Banner */}
				<div className="relative rounded-xl overflow-hidden mb-8">
					<img
						src={course.imageUrl || '/placeholder.svg'}
						alt={course.title}
						className="w-full h-64 md:h-80 object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
						<div className="text-white p-8 max-w-2xl">
							<h2 className="text-3xl font-bold mb-4">
								{course.title}
							</h2>
							<p className="mb-6">{course.description}</p>
							<div className="flex flex-wrap gap-4 text-sm">
								<Badge className="bg-white/20 hover:bg-white/30">
									{course.category}
								</Badge>
								<Badge className="bg-white/20 hover:bg-white/30">
									{course.level}
								</Badge>
								<Badge className="bg-white/20 hover:bg-white/30">
									{course.duration}
								</Badge>
								<Badge className="bg-white/20 hover:bg-white/30">
									Last updated: {course.lastUpdated}
								</Badge>
							</div>
						</div>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mt-8">
					<div className="md:col-span-2">
						<Tabs defaultValue="overview" className="w-full">
							<TabsList>
								<TabsTrigger value="overview">
									Overview
								</TabsTrigger>
								<TabsTrigger value="curriculum">
									Curriculum
								</TabsTrigger>
								<TabsTrigger value="instructor">
									Instructor
								</TabsTrigger>
							</TabsList>

							<TabsContent value="overview" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>About This Course</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-gray-600">
											{course.fullDescription}
										</p>

										<div className="pt-6">
											<h3 className="font-bold text-lg mb-4">
												What You'll Learn
											</h3>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{course.whatYouWillLearn.map(
													(item, index) => (
														<div
															key={index}
															className="flex gap-2"
														>
															<CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
															<span>{item}</span>
														</div>
													)
												)}
											</div>
										</div>

										<div className="pt-6">
											<h3 className="font-bold text-lg mb-4">
												Requirements
											</h3>
											<ul className="space-y-2">
												{course.requirements.map(
													(item, index) => (
														<li
															key={index}
															className="flex gap-2"
														>
															<div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
															<span>{item}</span>
														</li>
													)
												)}
											</ul>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="curriculum">
								<Card>
									<CardHeader>
										<CardTitle>Course Curriculum</CardTitle>
										<CardDescription>
											{course?.syllabus?.length || 0}{' '}
											weeks of content
										</CardDescription>
										{course?.isEnrolled && (
											<div className="mt-4">
												<div className="flex justify-between mb-2">
													<span className="text-sm text-muted-foreground">
														Overall Progress
													</span>
													<span className="text-sm font-medium">
														{Math.round(
															calculateProgress()
														)}
														%
													</span>
												</div>
												<Progress
													value={calculateProgress()}
													className="h-2"
												/>
											</div>
										)}
									</CardHeader>
									<CardContent className="space-y-4">
										{course?.isEnrolled ? (
											<>
												{course?.syllabus.map(
													(week, weekIndex) => (
														<Card
															key={weekIndex}
															className="p-4"
														>
															<div className="flex justify-between items-center mb-2">
																<h3 className="text-lg font-semibold">
																	Week{' '}
																	{week.week}:{' '}
																	{week.title}
																</h3>
																<Badge>
																	{
																		week.duration
																	}
																</Badge>
															</div>
															<div className="space-y-2">
																{week.topics.map(
																	(
																		topic,
																		topicIndex
																	) => (
																		<div
																			key={
																				topic.id
																			}
																			className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
																			onClick={() =>
																				setSelectedTopic(
																					topic
																				)
																			}
																		>
																			<div className="flex items-center gap-2">
																				<BookOpen className="h-4 w-4" />
																				<span>
																					{
																						topic.title
																					}
																				</span>
																			</div>
																			<div className="flex items-center gap-2">
																				<Button
																					variant="ghost"
																					size="sm"
																					onClick={(
																						e
																					) => {
																						e.stopPropagation();
																						handleTopicCompletion(
																							topic.id,
																							!progress[
																								topic
																									.id
																							]
																						);
																					}}
																				>
																					{progress[
																						topic
																							.id
																					] ? (
																						<CheckCircle className="h-4 w-4 text-primary" />
																					) : (
																						<Circle className="h-4 w-4" />
																					)}
																				</Button>
																			</div>
																		</div>
																	)
																)}
															</div>
														</Card>
													)
												)}

												{/* Content Dialog */}
												<Dialog
													open={!!selectedTopic}
													onOpenChange={() =>
														setSelectedTopic(null)
													}
												>
													<DialogContent className="max-w-4xl h-[80vh] flex flex-col">
														<DialogHeader>
															<DialogTitle>
																{
																	selectedTopic?.title
																}
															</DialogTitle>
														</DialogHeader>
														<div className="flex-1 overflow-y-auto">
															{selectedTopic?.content?.map(
																(
																	content,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="mb-4"
																	>
																		{content.type ===
																		'video' ? (
																			<div className="aspect-video">
																				<video
																					src={
																						content.url
																					}
																					controls
																					className="w-full h-full"
																				>
																					Your
																					browser
																					does
																					not
																					support
																					the
																					video
																					tag.
																				</video>
																			</div>
																		) : (
																			<div className="p-4 border rounded-lg">
																				<a
																					href={
																						content.url
																					}
																					target="_blank"
																					rel="noopener noreferrer"
																					className="flex items-center gap-2 text-primary hover:underline"
																				>
																					<File className="h-4 w-4" />
																					{
																						content.title
																					}
																				</a>
																			</div>
																		)}
																	</div>
																)
															)}
														</div>
														<DialogFooter>
															<Button
																onClick={() => {
																	if (
																		selectedTopic
																	) {
																		handleTopicCompletion(
																			selectedTopic.id,
																			!progress[
																				selectedTopic
																					.id
																			]
																		);
																	}
																}}
															>
																{progress[
																	selectedTopic?.id ||
																		''
																]
																	? 'Mark as Incomplete'
																	: 'Mark as Complete'}
															</Button>
														</DialogFooter>
													</DialogContent>
												</Dialog>
											</>
										) : (
											// Show preview for non-enrolled students
											<>
												{course?.syllabus.map(
													(week, index) => (
														<Card
															key={index}
															className="p-4"
														>
															<div className="flex justify-between items-center mb-2">
																<h3 className="text-lg font-semibold">
																	Week{' '}
																	{week.week}:{' '}
																	{week.title}
																</h3>
																<Badge>
																	{
																		week.duration
																	}
																</Badge>
															</div>
															<div className="space-y-2 opacity-50">
																{week.topics
																	.slice(0, 2)
																	.map(
																		(
																			topic,
																			topicIndex
																		) => (
																			<div
																				key={
																					topicIndex
																				}
																				className="flex items-center p-2"
																			>
																				<BookOpen className="h-4 w-4 mr-2" />
																				<span>
																					{
																						topic.title
																					}
																				</span>
																			</div>
																		)
																	)}
																{week.topics
																	.length >
																	2 && (
																	<div className="text-sm text-muted-foreground pl-6">
																		+{' '}
																		{week
																			.topics
																			.length -
																			2}{' '}
																		more
																		topics
																		(enroll
																		to
																		access)
																	</div>
																)}
															</div>
														</Card>
													)
												)}
												<div className="text-center p-4">
													<p className="text-muted-foreground mb-4">
														Enroll in this course to
														access all content
													</p>
													<Button
														onClick={handleEnroll}
														disabled={enrolling}
														className="gradient-bg hover:opacity-90"
													>
														{enrolling
															? 'Processing...'
															: `Enroll Now for $${course?.price}`}
													</Button>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="instructor">
								<Card>
									<CardHeader>
										<CardTitle>
											Meet Your Instructor
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col md:flex-row md:items-start gap-6">
											<div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
												<User className="h-16 w-16 text-gray-400" />
											</div>
											<div>
												<h3 className="text-xl font-bold mb-1">
													{course.instructor.name}
												</h3>
												<p className="text-muted-foreground mb-4">
													{course.instructor.email}
												</p>
												<div className="flex gap-4 mb-4">
													{course.rating && (
														<div className="flex items-center gap-1">
															<Star className="h-4 w-4 text-yellow-400" />
															<span>
																{course.rating}{' '}
																Instructor
																Rating
															</span>
														</div>
													)}
													{course.reviewsCount && (
														<div className="flex items-center gap-1">
															<User className="h-4 w-4 text-muted-foreground" />
															<span>
																{
																	course.reviewsCount
																}{' '}
																Reviews
															</span>
														</div>
													)}
													{course.studentsCount && (
														<div className="flex items-center gap-1">
															<GraduationCap className="h-4 w-4 text-muted-foreground" />
															<span>
																{
																	course.studentsCount
																}{' '}
																Students
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					<div>
						<Card className="sticky top-4">
							<CardHeader>
								<CardTitle>Course Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Clock className="h-5 w-5 text-primary" />
										<div>
											<h4 className="font-semibold">
												Duration
											</h4>
											<p className="text-sm text-muted-foreground">
												{course.duration}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<BookOpen className="h-5 w-5 text-primary" />
										<div>
											<h4 className="font-semibold">
												Lessons
											</h4>
											<p className="text-sm text-muted-foreground">
												{course.syllabus.reduce(
													(total, week) =>
														total +
														week.topics.length,
													0
												)}{' '}
												lessons
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<User className="h-5 w-5 text-primary" />
										<div>
											<h4 className="font-semibold">
												Instructor
											</h4>
											<p className="text-sm text-muted-foreground">
												{course.instructor.name}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<GraduationCap className="h-5 w-5 text-primary" />
										<div>
											<h4 className="font-semibold">
												Level
											</h4>
											<p className="text-sm text-muted-foreground">
												{course.level}
											</p>
										</div>
									</div>
								</div>

								{course.isEnrolled ? (
									<div className="text-center p-4 bg-primary/5 rounded-lg">
										<CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
										<p className="font-semibold text-primary">
											You are enrolled in this course
										</p>
										<p className="text-sm text-muted-foreground mt-1">
											Access all course content above
										</p>
									</div>
								) : (
									<>
										<Button
											className="w-full gradient-bg hover:opacity-90 transition-opacity"
											onClick={handleEnroll}
											disabled={enrolling}
										>
											{enrolling
												? 'Processing...'
												: 'Enroll Now'}
										</Button>
										<p className="text-center text-sm text-muted-foreground">
											30-day money-back guarantee
										</p>
									</>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
