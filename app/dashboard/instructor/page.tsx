'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	Book,
	BookOpen,
	GraduationCap,
	Plus,
	Users,
	Edit,
	Trash2,
	Video,
	File,
	DollarSign,
	Star,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Course options
const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const COURSE_DURATIONS = [
	'4 weeks',
	'8 weeks',
	'12 weeks',
	'16 weeks',
	'Self-paced',
];
const COURSE_CATEGORIES = [
	'Web Development',
	'Data Science',
	'Mobile Development',
	'AI & Machine Learning',
	'Design',
	'Business',
	'Language',
	'Other',
];

interface TopicContent {
	type: 'video' | 'file';
	title: string;
	url: string;
	fileType?: string;
	duration?: string;
}

interface Topic {
	id: string;
	title: string;
	content: TopicContent[];
}

interface Week {
	week: number;
	title: string;
	topics: Topic[];
	duration: string;
}

interface Course {
	id?: string;
	title: string;
	description: string;
	fullDescription: string;
	level: string;
	category: string;
	duration: string;
	price: string;
	imageUrl: string;
	syllabus: Week[];
	requirements: string[];
	whatYouWillLearn: string[];
	instructorId: string;
	lastUpdated: string;
	language: string;
}

// Add these helper functions at the top level
const addSyllabusWeek = (formData: any, setFormData: any) => {
	const newWeek = {
		week: formData.syllabus.length + 1,
		title: '',
		topics: [
			{
				id: crypto.randomUUID(),
				title: '',
				content: [],
			},
		],
		duration: '3 hours',
	};
	setFormData({
		...formData,
		syllabus: [...formData.syllabus, newWeek],
	});
};

const updateSyllabusWeek = (
	formData: any,
	setFormData: any,
	weekIndex: number,
	field: string,
	value: any
) => {
	const newSyllabus = [...formData.syllabus];
	newSyllabus[weekIndex] = {
		...newSyllabus[weekIndex],
		[field]: value,
	};
	setFormData({
		...formData,
		syllabus: newSyllabus,
	});
};

const addArrayItem = (formData: any, setFormData: any, field: string) => {
	setFormData({
		...formData,
		[field]: [...formData[field], ''],
	});
};

const updateArrayItem = (
	formData: any,
	setFormData: any,
	field: string,
	index: number,
	value: string
) => {
	const newArray = [...formData[field]];
	newArray[index] = value;
	setFormData({
		...formData,
		[field]: newArray,
	});
};

// Add file upload helper function
const handleFileUpload = async (file: File): Promise<string> => {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		if (!response.ok) {
			throw new Error('Failed to upload file');
		}

		const data = await response.json();
		return data.url;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	}
};

// Add content management functions
const addTopicContent = async (
	formData: any,
	setFormData: any,
	weekIndex: number,
	topicIndex: number,
	file: File,
	contentType: 'video' | 'file'
) => {
	try {
		const formDataToSend = new FormData();
		formDataToSend.append('file', file);
		formDataToSend.append(
			'weekId',
			formData.syllabus[weekIndex].week.toString()
		);
		formDataToSend.append(
			'topicId',
			formData.syllabus[weekIndex].topics[topicIndex].id
		);

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formDataToSend,
		});

		if (!response.ok) {
			throw new Error('Failed to upload file');
		}

		const data = await response.json();
		const newContent: TopicContent = {
			type: contentType,
			title: file.name,
			url: data.url,
			fileType: file.type,
			duration: contentType === 'video' ? '00:00' : undefined,
		};

		const newSyllabus = [...formData.syllabus];
		newSyllabus[weekIndex].topics[topicIndex].content.push(newContent);

		setFormData({
			...formData,
			syllabus: newSyllabus,
		});

		toast({
			title: 'Success',
			description: `${
				contentType === 'video' ? 'Video' : 'File'
			} uploaded successfully`,
		});
	} catch (error) {
		toast({
			title: 'Error',
			description: `Failed to upload ${contentType}. Please try again.`,
			variant: 'destructive',
		});
	}
};

const removeTopicContent = (
	formData: any,
	setFormData: any,
	weekIndex: number,
	topicIndex: number,
	contentIndex: number
) => {
	const newSyllabus = [...formData.syllabus];
	newSyllabus[weekIndex].topics[topicIndex].content.splice(contentIndex, 1);
	setFormData({
		...formData,
		syllabus: newSyllabus,
	});
};

// Add function to add a new topic
const addTopic = (formData: any, setFormData: any, weekIndex: number) => {
	const newSyllabus = [...formData.syllabus];
	newSyllabus[weekIndex].topics.push({
		id: crypto.randomUUID(),
		title: '',
		content: [],
	});
	setFormData({
		...formData,
		syllabus: newSyllabus,
	});
};

// Add image upload function
const handleImageUpload = async (
	file: File,
	currentFormData: Course,
	setFormData: (data: Course) => void
) => {
	try {
		const formDataToSend = new FormData();
		formDataToSend.append('file', file);
		formDataToSend.append('type', 'course-image');

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formDataToSend,
		});

		if (!response.ok) {
			throw new Error('Failed to upload image');
		}

		const data = await response.json();
		setFormData({
			...currentFormData,
			imageUrl: data.url,
		});

		toast({
			title: 'Success',
			description: 'Course image uploaded successfully',
		});
	} catch (error) {
		toast({
			title: 'Error',
			description: 'Failed to upload image. Please try again.',
			variant: 'destructive',
		});
	}
};

const fetchInstructorCourses = async (instructorId: string) => {
	try {
		const response = await fetch('/api/courses', {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Failed to fetch courses');
		}

		const courses = await response.json();
		return courses;
	} catch (error) {
		console.error('Error fetching courses:', error);
		toast({
			title: 'Error',
			description: 'Failed to fetch your courses',
			variant: 'destructive',
		});
		return [];
	}
};

export default function InstructorDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState('overview');
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingCourse, setEditingCourse] = useState<Course | null>(null);
	const [stats, setStats] = useState({
		totalCourses: 0,
		totalStudents: 0,
		totalRevenue: 0,
		averageRating: 0,
	});

	// Initialize form data
	const [formData, setFormData] = useState<Course>({
		title: '',
		description: '',
		fullDescription: '',
		level: COURSE_LEVELS[0],
		category: COURSE_CATEGORIES[0],
		duration: COURSE_DURATIONS[0],
		price: '',
		imageUrl: '',
		syllabus: [],
		requirements: [''],
		whatYouWillLearn: [''],
		instructorId: '',
		lastUpdated: new Date().toISOString(),
		language: 'English',
	});

	console.log('Session:', session); // Debug log

	useEffect(() => {
		// Handle URL parameters for tab switching
		const tabParam = searchParams.get('tab');
		if (tabParam === 'create') {
			console.log('URL param changed: Setting active tab to create');
			setActiveTab('create');
		} else if (tabParam === null || tabParam === '') {
			setActiveTab('courses');
		}
	}, [searchParams]);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
			return;
		}

		if (status === 'authenticated') {
			// Check if user is an instructor
			if (session?.user?.role !== 'instructor') {
				console.log('Not an instructor, redirecting to dashboard');
				router.push('/dashboard');
				return;
			}

			// Fetch real courses from the API
			const fetchCourses = async () => {
				try {
					console.log('Session state:', {
						userId: session.user.id,
						role: session.user.role,
						status: status,
					});

					console.log('Starting to fetch courses...');
					const response = await fetch('/api/courses', {
						headers: {
							'Content-Type': 'application/json',
						},
					});

					console.log('API Response status:', response.status);

					if (!response.ok) {
						const errorData = await response.text();
						console.error('API Error Response:', errorData);
						throw new Error(
							`Failed to fetch courses: ${response.status} ${errorData}`
						);
					}

					const data = await response.json();
					console.log(
						'Fetched courses data:',
						JSON.stringify(data, null, 2)
					);

					if (!Array.isArray(data)) {
						console.error('Received non-array data:', data);
						throw new Error('Invalid data format received');
					}

					setCourses(data);
					console.log(
						'Courses state updated:',
						data.length,
						'courses'
					);
				} catch (error) {
					console.error('Detailed error fetching courses:', error);
					toast({
						title: 'Error',
						description: 'Failed to fetch your courses',
						variant: 'destructive',
					});
				} finally {
					setLoading(false);
				}
			};

			fetchCourses();
		}
	}, [status, session, router, searchParams]);

	// Fetch instructor stats
	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/instructor/stats');
				if (response.ok) {
					const data = await response.json();
					setStats(data);
				}
			} catch (error) {
				console.error('Error fetching instructor stats:', error);
			}
		};

		if (session?.user) {
			fetchStats();
		}
	}, [session]);

	// Handle tab change
	const handleTabChange = (value: string) => {
		setActiveTab(value);

		// Update URL without full page reload
		const url = new URL(window.location.href);
		if (value === 'create') {
			url.searchParams.set('tab', 'create');
		} else {
			url.searchParams.delete('tab');
		}

		router.replace(url.pathname + url.search, { scroll: false });
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleEditCourse = (course: Course) => {
		router.push(`/dashboard/instructor/courses/edit/${course.id}`);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			console.log('Submitting form data:', formData);

			const response = await fetch('/api/courses', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: formData.title,
					description: formData.description,
					fullDescription: formData.fullDescription || '',
					level: formData.level,
					category: formData.category,
					duration: formData.duration,
					price: formData.price,
					imageUrl: formData.imageUrl,
					language: formData.language || 'English',
					syllabus: formData.syllabus || [],
					requirements: formData.requirements || [],
					whatYouWillLearn: formData.whatYouWillLearn || [],
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				console.error('Error response:', error);
				toast({
					title: 'Error',
					description: error.details || 'Failed to create course',
					variant: 'destructive',
				});
				return;
			}

			const course = await response.json();
			console.log('Created course:', course);
			toast({
				title: 'Success',
				description: 'Course created successfully!',
			});
			router.push('/dashboard/instructor');
		} catch (error) {
			console.error('Error creating course:', error);
			toast({
				title: 'Error',
				description: 'Failed to create course',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteCourse = async (courseId?: string) => {
		if (!courseId) return;

		try {
			const response = await fetch(`/api/courses/${courseId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete course');
			}

			// Remove the course from the state
			setCourses(courses.filter((course) => course.id !== courseId));
			toast({
				title: 'Success',
				description: 'Course deleted successfully',
			});
		} catch (error) {
			console.error('Error deleting course:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete course',
				variant: 'destructive',
			});
		}
	};

	// Add fetchCourses function
	const fetchCourses = async () => {
		try {
			const response = await fetch('/api/courses');
			if (!response.ok) {
				throw new Error('Failed to fetch courses');
			}
			const data = await response.json();
			setCourses(data);
		} catch (error) {
			console.error('Error fetching courses:', error);
			toast({
				title: 'Error',
				description: 'Failed to fetch courses. Please try again.',
				variant: 'destructive',
			});
		}
	};

	if (status === 'loading' || loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	// If the user is not an instructor, this component should not render
	if (status === 'unauthenticated' || session?.user?.role !== 'instructor') {
		return null;
	}

	return (
		<div className="container py-10">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold gradient-text">
					Instructor Dashboard
				</h1>

				<Button
					onClick={() => handleTabChange('create')}
					className="gradient-bg hover:opacity-90"
				>
					<Plus className="mr-2 h-4 w-4" /> Create Course
				</Button>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="mb-8"
			>
				<TabsList className="mb-6 w-full md:w-auto">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="courses">My Courses</TabsTrigger>
					<TabsTrigger value="create">Create New Course</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Students
								</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{stats.totalStudents}
								</div>
								<p className="text-xs text-muted-foreground">
									Enrolled across all courses
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total Revenue
								</CardTitle>
								<DollarSign className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									${stats.totalRevenue.toFixed(2)}
								</div>
								<p className="text-xs text-muted-foreground">
									Lifetime earnings
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active Courses
								</CardTitle>
								<BookOpen className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{stats.totalCourses}
								</div>
								<p className="text-xs text-muted-foreground">
									Published courses
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Average Rating
								</CardTitle>
								<Star className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{stats.averageRating.toFixed(1)}
								</div>
								<p className="text-xs text-muted-foreground">
									From all courses
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="courses">
					{courses.length > 0 ? (
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{courses.map((course) => (
								<Card key={course.id} className="flex flex-col">
									<CardHeader>
										<CardTitle className="flex items-center justify-between">
											<span>{course.title}</span>
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														handleEditCourse(course)
													}
													className="h-8 w-8 p-0"
												>
													<Edit className="h-4 w-4" />
												</Button>
												{course.id && (
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleDeleteCourse(
																course.id!
															)
														}
														className="h-8 w-8 p-0"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												)}
											</div>
										</CardTitle>
										<CardDescription>
											{course.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col space-y-2">
											<p>
												<strong>Level:</strong>{' '}
												{course.level}
											</p>
											<p>
												<strong>Duration:</strong>{' '}
												{course.duration}
											</p>
											<p>
												<strong>Price:</strong> $
												{course.price}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center bg-muted/20 rounded-lg p-12">
							<Book className="h-16 w-16 text-muted mb-4" />
							<h3 className="text-xl font-medium mb-2">
								No Courses Created
							</h3>
							<p className="text-muted-foreground text-center mb-6">
								You haven't created any courses yet. Start by
								creating your first course.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="create">
					<Card>
						<CardHeader>
							<CardTitle>
								{isEditing
									? 'Edit Course'
									: 'Create New Course'}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-8">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="title">
											Course Title
										</Label>
										<Input
											id="title"
											name="title"
											value={formData.title}
											onChange={handleInputChange}
											required
										/>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="description">
											Short Description
										</Label>
										<Textarea
											id="description"
											name="description"
											value={formData.description}
											onChange={handleInputChange}
											required
										/>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="fullDescription">
											Full Description
										</Label>
										<Textarea
											id="fullDescription"
											name="fullDescription"
											value={formData.fullDescription}
											onChange={handleInputChange}
											required
											className="min-h-[150px]"
										/>
									</div>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="grid gap-2">
										<Label htmlFor="level">Level</Label>
										<Select
											value={formData.level}
											onValueChange={(value) =>
												handleSelectChange(
													'level',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{COURSE_LEVELS.map((level) => (
													<SelectItem
														key={level}
														value={level}
													>
														{level}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="category">
											Category
										</Label>
										<Select
											value={formData.category}
											onValueChange={(value) =>
												handleSelectChange(
													'category',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{COURSE_CATEGORIES.map(
													(category) => (
														<SelectItem
															key={category}
															value={category}
														>
															{category}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="grid gap-2">
										<Label htmlFor="duration">
											Duration
										</Label>
										<Select
											value={formData.duration}
											onValueChange={(value) =>
												handleSelectChange(
													'duration',
													value
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												{COURSE_DURATIONS.map(
													(duration) => (
														<SelectItem
															key={duration}
															value={duration}
														>
															{duration}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="price">Price ($)</Label>
										<Input
											id="price"
											name="price"
											type="number"
											min="0"
											step="0.01"
											value={formData.price}
											onChange={handleInputChange}
											required
										/>
									</div>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="courseImage">
										Course Image
									</Label>
									<div className="flex items-center gap-4">
										<div className="relative">
											<input
												type="file"
												accept="image/*"
												className="hidden"
												id="course-image-upload"
												onChange={(e) => {
													const file =
														e.target.files?.[0];
													if (file) {
														handleImageUpload(
															file,
															formData,
															setFormData
														);
													}
												}}
											/>
											<Button
												type="button"
												variant="outline"
												onClick={() =>
													document
														.getElementById(
															'course-image-upload'
														)
														?.click()
												}
											>
												<Plus className="h-4 w-4 mr-2" />{' '}
												Upload Image
											</Button>
										</div>
										{formData.imageUrl && (
											<div className="relative w-24 h-24">
												<img
													src={formData.imageUrl}
													alt="Course preview"
													className="w-full h-full object-cover rounded-md"
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
													onClick={() =>
														setFormData({
															...formData,
															imageUrl: '',
														})
													}
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</div>
										)}
									</div>
								</div>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label>Course Curriculum</Label>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												addSyllabusWeek(
													formData,
													setFormData
												)
											}
										>
											<Plus className="h-4 w-4 mr-2" />{' '}
											Add Week
										</Button>
									</div>
									{formData.syllabus.map(
										(week, weekIndex) => (
											<Card
												key={weekIndex}
												className="p-4"
											>
												<div className="space-y-4">
													<div className="grid gap-2">
														<Label>
															Week {week.week}{' '}
															Title
														</Label>
														<Input
															value={week.title}
															onChange={(e) =>
																updateSyllabusWeek(
																	formData,
																	setFormData,
																	weekIndex,
																	'title',
																	e.target
																		.value
																)
															}
															placeholder="Week title"
														/>
													</div>
													<div className="space-y-4">
														<div className="flex items-center justify-between">
															<Label>
																Topics
															</Label>
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	addTopic(
																		formData,
																		setFormData,
																		weekIndex
																	)
																}
															>
																<Plus className="h-4 w-4 mr-2" />{' '}
																Add Topic
															</Button>
														</div>
														{week.topics.map(
															(
																topic,
																topicIndex
															) => (
																<div
																	key={
																		topic.id
																	}
																	className="space-y-4 p-4 border rounded-lg"
																>
																	<Input
																		value={
																			topic.title
																		}
																		onChange={(
																			e
																		) => {
																			const newSyllabus =
																				[
																					...formData.syllabus,
																				];
																			newSyllabus[
																				weekIndex
																			].topics[
																				topicIndex
																			].title =
																				e.target.value;
																			setFormData(
																				{
																					...formData,
																					syllabus:
																						newSyllabus,
																				}
																			);
																		}}
																		placeholder="Topic title"
																		className="mb-2"
																	/>
																	<div className="space-y-2">
																		<div className="flex gap-2">
																			<div className="relative">
																				<input
																					type="file"
																					accept="video/*"
																					className="hidden"
																					id={`video-upload-${weekIndex}-${topicIndex}`}
																					onChange={(
																						e
																					) => {
																						const file =
																							e
																								.target
																								.files?.[0];
																						if (
																							file
																						) {
																							addTopicContent(
																								formData,
																								setFormData,
																								weekIndex,
																								topicIndex,
																								file,
																								'video'
																							);
																						}
																					}}
																				/>
																				<Button
																					type="button"
																					variant="outline"
																					size="sm"
																					onClick={() =>
																						document
																							.getElementById(
																								`video-upload-${weekIndex}-${topicIndex}`
																							)
																							?.click()
																					}
																				>
																					<Plus className="h-4 w-4 mr-2" />{' '}
																					Add
																					Video
																				</Button>
																			</div>
																			<div className="relative">
																				<input
																					type="file"
																					className="hidden"
																					id={`file-upload-${weekIndex}-${topicIndex}`}
																					onChange={(
																						e
																					) => {
																						const file =
																							e
																								.target
																								.files?.[0];
																						if (
																							file
																						) {
																							addTopicContent(
																								formData,
																								setFormData,
																								weekIndex,
																								topicIndex,
																								file,
																								'file'
																							);
																						}
																					}}
																				/>
																				<Button
																					type="button"
																					variant="outline"
																					size="sm"
																					onClick={() =>
																						document
																							.getElementById(
																								`file-upload-${weekIndex}-${topicIndex}`
																							)
																							?.click()
																					}
																				>
																					<Plus className="h-4 w-4 mr-2" />{' '}
																					Add
																					File
																				</Button>
																			</div>
																		</div>
																		{topic.content &&
																			topic
																				.content
																				.length >
																				0 && (
																				<div className="mt-4 space-y-2">
																					{topic.content.map(
																						(
																							content,
																							contentIndex
																						) => (
																							<div
																								key={
																									contentIndex
																								}
																								className="flex items-center justify-between p-2 bg-muted rounded-md"
																							>
																								<div className="flex items-center gap-2">
																									{content.type ===
																									'video' ? (
																										<Video className="h-4 w-4" />
																									) : (
																										<File className="h-4 w-4" />
																									)}
																									<span className="text-sm">
																										{
																											content.title
																										}
																									</span>
																								</div>
																								<Button
																									type="button"
																									variant="ghost"
																									size="sm"
																									onClick={() =>
																										removeTopicContent(
																											formData,
																											setFormData,
																											weekIndex,
																											topicIndex,
																											contentIndex
																										)
																									}
																									className="h-8 w-8 p-0"
																								>
																									<Trash2 className="h-4 w-4" />
																								</Button>
																							</div>
																						)
																					)}
																				</div>
																			)}
																	</div>
																</div>
															)
														)}
													</div>
												</div>
											</Card>
										)
									)}
								</div>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label>Requirements</Label>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												addArrayItem(
													formData,
													setFormData,
													'requirements'
												)
											}
										>
											<Plus className="h-4 w-4 mr-2" />{' '}
											Add Requirement
										</Button>
									</div>
									{formData.requirements.map((req, index) => (
										<Input
											key={index}
											value={req}
											onChange={(e) =>
												updateArrayItem(
													formData,
													setFormData,
													'requirements',
													index,
													e.target.value
												)
											}
											placeholder="Requirement"
										/>
									))}
								</div>

								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<Label>What You Will Learn</Label>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												addArrayItem(
													formData,
													setFormData,
													'whatYouWillLearn'
												)
											}
										>
											<Plus className="h-4 w-4 mr-2" />{' '}
											Add Learning Outcome
										</Button>
									</div>
									{formData.whatYouWillLearn.map(
										(item, index) => (
											<Input
												key={index}
												value={item}
												onChange={(e) =>
													updateArrayItem(
														formData,
														setFormData,
														'whatYouWillLearn',
														index,
														e.target.value
													)
												}
												placeholder="Learning outcome"
											/>
										)
									)}
								</div>

								<Button
									type="submit"
									className="w-full gradient-bg hover:opacity-90"
								>
									<Plus className="mr-2 h-4 w-4" /> Create
									Course
								</Button>
							</form>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
