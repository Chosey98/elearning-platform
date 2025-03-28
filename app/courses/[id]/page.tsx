'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Mock course data (expanded from the courses page)
const COURSES = [
	{
		id: 1,
		title: 'Introduction to Web Development',
		description:
			'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
		fullDescription:
			"This comprehensive course introduces you to the world of web development, starting with the fundamentals of HTML for structure, CSS for styling, and JavaScript for interactivity. You'll progress from simple static pages to dynamic, interactive websites. By the end of this course, you'll have a solid foundation in web development and the ability to create your own responsive websites from scratch.",
		level: 'Beginner',
		duration: '8 weeks',
		instructor: {
			name: 'Sarah Johnson',
			title: 'Senior Web Developer',
			bio: 'Sarah has over 10 years of experience in web development and has worked with companies like Google and Facebook. She specializes in frontend technologies and is passionate about teaching coding to beginners.',
			image: '/placeholder.svg?height=100&width=100',
		},
		image: '/placeholder.svg?height=200&width=300',
		category: 'Web Development',
		color: 'from-purple-500 to-pink-500',
		price: 49.99,
		rating: 4.8,
		reviewsCount: 243,
		studentsCount: 1845,
		lastUpdated: 'June 2023',
		language: 'English',
		syllabus: [
			{
				week: 1,
				title: 'Introduction to HTML',
				topics: [
					'Basic HTML structure',
					'Common HTML elements',
					'Creating your first webpage',
				],
				duration: '3 hours',
			},
			{
				week: 2,
				title: 'Styling with CSS',
				topics: [
					'CSS selectors',
					'Colors and typography',
					'Box model and layouts',
				],
				duration: '3 hours',
			},
			{
				week: 3,
				title: 'CSS Layouts and Flexbox',
				topics: [
					'Flexbox layouts',
					'Responsive design principles',
					'Media queries',
				],
				duration: '3 hours',
			},
			{
				week: 4,
				title: 'Introduction to JavaScript',
				topics: [
					'Variables and data types',
					'Functions and control flow',
					'DOM manipulation',
				],
				duration: '3 hours',
			},
			{
				week: 5,
				title: 'Working with Events',
				topics: [
					'Event handling',
					'Event listeners',
					'Form validation',
				],
				duration: '3 hours',
			},
			{
				week: 6,
				title: 'APIs and Fetch',
				topics: [
					'What are APIs',
					'Using fetch',
					'Working with JSON data',
				],
				duration: '3 hours',
			},
			{
				week: 7,
				title: 'Building a Complete Project',
				topics: [
					'Project planning',
					'Implementation',
					'Testing and debugging',
				],
				duration: '3 hours',
			},
			{
				week: 8,
				title: 'Deployment and Next Steps',
				topics: [
					'Hosting options',
					'Domain setup',
					'Future learning paths',
				],
				duration: '3 hours',
			},
		],
		requirements: [
			'Basic computer skills',
			'No prior coding experience required',
			'A computer with internet access',
			'Text editor (recommended: VS Code)',
		],
		whatYouWillLearn: [
			'Build websites using HTML, CSS, and JavaScript',
			'Understand web development fundamentals',
			'Create responsive layouts that work on all devices',
			'Implement interactive features with JavaScript',
			'Connect to APIs to fetch and display data',
			'Deploy your websites to the internet',
		],
		images: [
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
		],
	},
	{
		id: 2,
		title: 'Advanced React Patterns',
		description:
			'Master advanced React concepts including hooks, context, and performance optimization.',
		fullDescription:
			"Take your React skills to the next level with this advanced course. You'll dive deep into modern React patterns, learning how to build efficient, maintainable applications with hooks, context, and other advanced features. We'll cover performance optimization techniques, state management strategies, and best practices for structuring large React applications. By the end of this course, you'll be able to architect and build sophisticated React applications using the latest patterns and techniques.",
		level: 'Advanced',
		duration: '6 weeks',
		instructor: {
			name: 'Michael Chen',
			title: 'Lead Frontend Engineer',
			bio: "Michael has been working with React since its early days and leads frontend development at a top tech startup. He's contributed to several open-source React libraries and specializes in building high-performance web applications.",
			image: '/placeholder.svg?height=100&width=100',
		},
		image: '/placeholder.svg?height=200&width=300',
		category: 'Frontend',
		color: 'from-blue-500 to-cyan-500',
		price: 79.99,
		rating: 4.9,
		reviewsCount: 187,
		studentsCount: 1243,
		lastUpdated: 'August 2023',
		language: 'English',
		syllabus: [
			{
				week: 1,
				title: 'Modern React Fundamentals Review',
				topics: [
					'Functional components',
					'React hooks basics',
					'JSX and rendering',
				],
				duration: '3 hours',
			},
			{
				week: 2,
				title: 'Advanced Hooks',
				topics: ['useCallback', 'useMemo', 'useRef', 'Custom hooks'],
				duration: '3 hours',
			},
			{
				week: 3,
				title: 'Context and State Management',
				topics: [
					'Context API',
					'State management patterns',
					'Comparing with Redux',
				],
				duration: '3 hours',
			},
			{
				week: 4,
				title: 'Performance Optimization',
				topics: [
					'React.memo',
					'Component memoization',
					'Virtualization techniques',
				],
				duration: '3 hours',
			},
			{
				week: 5,
				title: 'Advanced Patterns',
				topics: [
					'Compound components',
					'Render props',
					'Higher-order components',
				],
				duration: '3 hours',
			},
			{
				week: 6,
				title: 'Building a Production Application',
				topics: [
					'Project architecture',
					'Testing strategies',
					'Deployment considerations',
				],
				duration: '3 hours',
			},
		],
		requirements: [
			'Solid understanding of React fundamentals',
			'Experience with JavaScript ES6+',
			'Familiarity with NPM and build tools',
			'Prior experience building React applications',
		],
		whatYouWillLearn: [
			'Implement advanced React patterns and hooks',
			'Optimize React applications for performance',
			'Build reusable component libraries',
			'Manage state effectively in complex applications',
			'Structure large-scale React applications',
			'Test and debug React components',
		],
		images: [
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
			'/placeholder.svg?height=400&width=600',
		],
	},
];

export default function CourseDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const router = useRouter();
	const { toast } = useToast();
	const [enrolling, setEnrolling] = useState(false);
	const [message, setMessage] = useState<string>('');

	// Find the course by ID
	const course =
		COURSES.find((c) => c.id.toString() === params.id) || COURSES[0];

	const handleEnroll = () => {
		setEnrolling(true);

		// Simulate API call
		setTimeout(() => {
			setEnrolling(false);

			toast({
				title: 'Successfully Enrolled!',
				description: `You have enrolled in "${course.title}". Check your email for details.`,
			});

			router.push('/dashboard');
		}, 1500);
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
								onClick={handleSaveCourse}
								className="border-primary/20 hover:bg-primary/5"
							>
								<Heart className="mr-2 h-4 w-4" /> Save
							</Button>
							<Button
								variant="outline"
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
						src={course.images[0] || '/placeholder.svg'}
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

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<Tabs defaultValue="overview">
							<TabsList className="mb-4">
								<TabsTrigger value="overview">
									Overview
								</TabsTrigger>
								<TabsTrigger value="curriculum">
									Curriculum
								</TabsTrigger>
								<TabsTrigger value="instructor">
									Instructor
								</TabsTrigger>
								<TabsTrigger value="reviews">
									Reviews
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
											{course.syllabus.length} weeks •{' '}
											{course.syllabus.reduce(
												(total, week) =>
													total +
													parseInt(week.duration),
												0
											)}{' '}
											hours total
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-6">
											{course.syllabus.map(
												(week, index) => (
													<div
														key={index}
														className="border rounded-lg overflow-hidden"
													>
														<div className="flex items-center justify-between bg-gray-50 p-4">
															<div>
																<h3 className="font-bold">
																	Week{' '}
																	{week.week}:{' '}
																	{week.title}
																</h3>
																<p className="text-sm text-muted-foreground">
																	{
																		week.duration
																	}
																</p>
															</div>
															<Badge
																variant="outline"
																className="border-primary/20 text-primary"
															>
																{
																	week.topics
																		.length
																}{' '}
																lessons
															</Badge>
														</div>
														<div className="p-4">
															<ul className="space-y-2">
																{week.topics.map(
																	(
																		topic,
																		topicIndex
																	) => (
																		<li
																			key={
																				topicIndex
																			}
																			className="flex gap-2"
																		>
																			<BookOpen className="h-5 w-5 text-muted-foreground" />
																			<span>
																				{
																					topic
																				}
																			</span>
																		</li>
																	)
																)}
															</ul>
														</div>
													</div>
												)
											)}
										</div>
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
											<img
												src={course.instructor.image}
												alt={course.instructor.name}
												className="w-32 h-32 rounded-full object-cover"
											/>
											<div>
												<h3 className="text-xl font-bold mb-1">
													{course.instructor.name}
												</h3>
												<p className="text-muted-foreground mb-4">
													{course.instructor.title}
												</p>
												<div className="flex gap-4 mb-4">
													<div className="flex items-center gap-1">
														<Star className="h-4 w-4 text-yellow-400" />
														<span>
															{course.rating}{' '}
															Instructor Rating
														</span>
													</div>
													<div className="flex items-center gap-1">
														<User className="h-4 w-4 text-muted-foreground" />
														<span>
															{
																course.reviewsCount
															}{' '}
															Reviews
														</span>
													</div>
													<div className="flex items-center gap-1">
														<GraduationCap className="h-4 w-4 text-muted-foreground" />
														<span>
															{
																course.studentsCount
															}{' '}
															Students
														</span>
													</div>
												</div>
												<p className="text-gray-600">
													{course.instructor.bio}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="reviews">
								<Card>
									<CardHeader>
										<CardTitle>Student Reviews</CardTitle>
										<CardDescription>
											{course.rating} course rating •{' '}
											{course.reviewsCount} ratings
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col md:flex-row gap-8 mb-6">
											<div className="flex flex-col items-center justify-center md:w-1/3">
												<div className="text-5xl font-bold text-center mb-2">
													{course.rating}
												</div>
												<div className="flex gap-1 mb-2">
													{[1, 2, 3, 4, 5].map(
														(star) => (
															<Star
																key={star}
																className={`h-5 w-5 ${
																	star <=
																	Math.floor(
																		course.rating
																	)
																		? 'text-yellow-400 fill-yellow-400'
																		: 'text-gray-300'
																}`}
															/>
														)
													)}
												</div>
												<p className="text-center text-muted-foreground">
													Course Rating
												</p>
											</div>

											<div className="md:w-2/3 space-y-2">
												{[5, 4, 3, 2, 1].map((num) => (
													<div
														key={num}
														className="flex items-center gap-4"
													>
														<div className="flex items-center gap-1 w-20">
															<span>{num}</span>
															<Star className="h-4 w-4 text-yellow-400" />
														</div>
														<Progress
															value={
																num === 5
																	? 70
																	: num === 4
																	? 20
																	: num === 3
																	? 7
																	: num === 2
																	? 2
																	: 1
															}
															className="h-2"
														/>
														<span className="text-sm text-muted-foreground w-12">
															{num === 5
																? '70%'
																: num === 4
																? '20%'
																: num === 3
																? '7%'
																: num === 2
																? '2%'
																: '1%'}
														</span>
													</div>
												))}
											</div>
										</div>

										{/* Mock Reviews */}
										<div className="space-y-6">
											<div className="border-b pb-6">
												<div className="flex justify-between mb-2">
													<div className="flex items-center gap-2">
														<div className="w-10 h-10 rounded-full bg-gray-200"></div>
														<div>
															<h4 className="font-semibold">
																Alex Thompson
															</h4>
															<div className="flex gap-1">
																{[
																	1, 2, 3, 4,
																	5,
																].map(
																	(star) => (
																		<Star
																			key={
																				star
																			}
																			className="h-3 w-3 text-yellow-400 fill-yellow-400"
																		/>
																	)
																)}
															</div>
														</div>
													</div>
													<span className="text-sm text-muted-foreground">
														2 weeks ago
													</span>
												</div>
												<p>
													This course was exactly what
													I needed to get started with
													web development. The
													instructor explains complex
													concepts in a simple way,
													and the projects were fun to
													work on.
												</p>
											</div>

											<div className="border-b pb-6">
												<div className="flex justify-between mb-2">
													<div className="flex items-center gap-2">
														<div className="w-10 h-10 rounded-full bg-gray-200"></div>
														<div>
															<h4 className="font-semibold">
																Maria Rodriguez
															</h4>
															<div className="flex gap-1">
																{[
																	1, 2, 3, 4,
																	5,
																].map(
																	(star) => (
																		<Star
																			key={
																				star
																			}
																			className={`h-3 w-3 ${
																				star <=
																				4
																					? 'text-yellow-400 fill-yellow-400'
																					: 'text-gray-300'
																			}`}
																		/>
																	)
																)}
															</div>
														</div>
													</div>
													<span className="text-sm text-muted-foreground">
														1 month ago
													</span>
												</div>
												<p>
													Great content and
													well-structured lessons. I
													would have liked more
													advanced examples, but
													overall it was worth the
													investment.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8 border-0 shadow-xl">
							<CardHeader
								className={`bg-gradient-to-r ${course.color} text-white`}
							>
								<CardTitle className="text-2xl">
									${course.price}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-6 space-y-6">
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

								<Button
									className="w-full gradient-bg hover:opacity-90 transition-opacity"
									onClick={handleEnroll}
									disabled={enrolling}
								>
									{enrolling ? 'Processing...' : 'Enroll Now'}
								</Button>

								<p className="text-center text-sm text-muted-foreground">
									30-day money-back guarantee
								</p>
							</CardContent>
							<CardFooter className="flex flex-col p-6 pt-0 space-y-4">
								<div>
									<h4 className="font-semibold mb-2">
										Have a Question?
									</h4>
									<Textarea
										placeholder="Write your message to the instructor"
										className="mb-2"
										value={message}
										onChange={(e) =>
											setMessage(e.target.value)
										}
									/>
									<Button
										variant="outline"
										className="w-full border-primary/20"
										onClick={handleContactInstructor}
									>
										Contact Instructor
									</Button>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
