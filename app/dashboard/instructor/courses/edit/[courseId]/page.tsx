'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { handleImageUpload } from '@/lib/courseHelpers';

// Course options (same as in the create page)
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

export default function EditCoursePage({
	params,
}: {
	params: { courseId: string };
}) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState<Course | null>(null);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
			return;
		}

		if (status === 'authenticated') {
			if (session?.user?.role !== 'instructor') {
				router.push('/dashboard');
				return;
			}

			// Fetch course data
			const fetchCourse = async () => {
				try {
					console.log('Fetching course:', params.courseId);
					const response = await fetch(
						`/api/courses/${params.courseId}`
					);

					if (!response.ok) {
						throw new Error('Failed to fetch course');
					}

					const course = await response.json();
					console.log('Fetched course:', course);
					setFormData(course);
				} catch (error) {
					console.error('Error fetching course:', error);
					toast({
						title: 'Error',
						description: 'Failed to fetch course details',
						variant: 'destructive',
					});
				} finally {
					setLoading(false);
				}
			};

			fetchCourse();
		}
	}, [status, session, router, params.courseId]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) =>
			prev
				? {
						...prev,
						[name]: value,
				  }
				: null
		);
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) =>
			prev
				? {
						...prev,
						[name]: value,
				  }
				: null
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData) return;

		setSubmitting(true);
		try {
			console.log('Updating course:', formData);
			const response = await fetch(`/api/courses/${params.courseId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Failed to update course');
			}

			toast({
				title: 'Success',
				description: 'Course updated successfully',
			});
			router.push('/dashboard/instructor?tab=courses');
		} catch (error) {
			console.error('Error updating course:', error);
			toast({
				title: 'Error',
				description: 'Failed to update course',
				variant: 'destructive',
			});
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!formData) {
		return (
			<div className="container py-10">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Course not found
					</h1>
					<Button
						onClick={() =>
							router.push('/dashboard/instructor?tab=courses')
						}
					>
						Back to Courses
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold gradient-text">
					Edit Course
				</h1>
				<Button
					onClick={() =>
						router.push('/dashboard/instructor?tab=courses')
					}
					variant="outline"
				>
					Cancel
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Edit Course Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-8">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="title">Course Title</Label>
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
										handleSelectChange('level', value)
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
								<Label htmlFor="category">Category</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										handleSelectChange('category', value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent>
										{COURSE_CATEGORIES.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="duration">Duration</Label>
								<Select
									value={formData.duration}
									onValueChange={(value) =>
										handleSelectChange('duration', value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent>
										{COURSE_DURATIONS.map((duration) => (
											<SelectItem
												key={duration}
												value={duration}
											>
												{duration}
											</SelectItem>
										))}
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

						<div className="grid gap-4 md:grid-cols-2">
							<div className="grid gap-2">
								<Label htmlFor="language">Language</Label>
								<Input
									id="language"
									name="language"
									value={formData.language}
									onChange={handleInputChange}
									required
								/>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="courseImage">Course Image</Label>
							<div className="flex items-center gap-4">
								<div className="relative">
									<input
										type="file"
										accept="image/*"
										className="hidden"
										id="course-image-upload"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file && formData) {
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
										<Plus className="h-4 w-4 mr-2" /> Upload
										Image
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
												setFormData((prev) =>
													prev
														? {
																...prev,
																imageUrl: '',
														  }
														: null
												)
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
									onClick={() => {
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
										setFormData((prev) =>
											prev
												? {
														...prev,
														syllabus: [
															...prev.syllabus,
															newWeek,
														],
												  }
												: null
										);
									}}
								>
									<Plus className="h-4 w-4 mr-2" /> Add Week
								</Button>
							</div>
							{formData.syllabus.map((week, weekIndex) => (
								<Card key={weekIndex} className="p-4">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="grid gap-2 flex-1 mr-4">
												<Label>
													Week {week.week} Title
												</Label>
												<Input
													value={week.title}
													onChange={(e) => {
														const newSyllabus = [
															...formData.syllabus,
														];
														newSyllabus[
															weekIndex
														].title =
															e.target.value;
														setFormData((prev) =>
															prev
																? {
																		...prev,
																		syllabus:
																			newSyllabus,
																  }
																: null
														);
													}}
													placeholder="Week title"
												/>
											</div>
											<div className="grid gap-2 w-32">
												<Label>Duration</Label>
												<Input
													value={week.duration}
													onChange={(e) => {
														const newSyllabus = [
															...formData.syllabus,
														];
														newSyllabus[
															weekIndex
														].duration =
															e.target.value;
														setFormData((prev) =>
															prev
																? {
																		...prev,
																		syllabus:
																			newSyllabus,
																  }
																: null
														);
													}}
													placeholder="e.g., 3 hours"
												/>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-10 w-10 ml-2"
												onClick={() => {
													const newSyllabus =
														formData.syllabus.filter(
															(_, i) =>
																i !== weekIndex
														);
													// Update week numbers
													newSyllabus.forEach(
														(w, i) =>
															(w.week = i + 1)
													);
													setFormData((prev) =>
														prev
															? {
																	...prev,
																	syllabus:
																		newSyllabus,
															  }
															: null
													);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<Label>Topics</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => {
														const newSyllabus = [
															...formData.syllabus,
														];
														newSyllabus[
															weekIndex
														].topics.push({
															id: crypto.randomUUID(),
															title: '',
															content: [],
														});
														setFormData((prev) =>
															prev
																? {
																		...prev,
																		syllabus:
																			newSyllabus,
																  }
																: null
														);
													}}
												>
													<Plus className="h-4 w-4 mr-2" />{' '}
													Add Topic
												</Button>
											</div>
											{week.topics.map(
												(
													topic: Topic,
													topicIndex: number
												) => (
													<div
														key={topic.id}
														className="space-y-4 p-4 border rounded-lg"
													>
														<div className="flex gap-2">
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
																		(
																			prev
																		) =>
																			prev
																				? {
																						...prev,
																						syllabus:
																							newSyllabus,
																				  }
																				: null
																	);
																}}
																placeholder="Topic title"
																className="flex-1"
															/>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={() => {
																	const newSyllabus =
																		[
																			...formData.syllabus,
																		];
																	newSyllabus[
																		weekIndex
																	].topics =
																		newSyllabus[
																			weekIndex
																		].topics.filter(
																			(
																				_,
																				i
																			) =>
																				i !==
																				topicIndex
																		);
																	setFormData(
																		(
																			prev
																		) =>
																			prev
																				? {
																						...prev,
																						syllabus:
																							newSyllabus,
																				  }
																				: null
																	);
																}}
																className="h-10 w-10"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
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
																				// Handle video upload
																				// TODO: Implement file upload
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
																				// Handle file upload
																				// TODO: Implement file upload
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
																		Add File
																	</Button>
																</div>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</Card>
							))}
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>Requirements</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setFormData((prev) =>
											prev
												? {
														...prev,
														requirements: [
															...prev.requirements,
															'',
														],
												  }
												: null
										);
									}}
								>
									<Plus className="h-4 w-4 mr-2" /> Add
									Requirement
								</Button>
							</div>
							{formData.requirements.map((req, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={req}
										onChange={(e) => {
											const newRequirements = [
												...formData.requirements,
											];
											newRequirements[index] =
												e.target.value;
											setFormData((prev) =>
												prev
													? {
															...prev,
															requirements:
																newRequirements,
													  }
													: null
											);
										}}
										placeholder="Requirement"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => {
											const newRequirements =
												formData.requirements.filter(
													(_, i) => i !== index
												);
											setFormData((prev) =>
												prev
													? {
															...prev,
															requirements:
																newRequirements,
													  }
													: null
											);
										}}
										className="h-10 w-10"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label>What You Will Learn</Label>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										setFormData((prev) =>
											prev
												? {
														...prev,
														whatYouWillLearn: [
															...prev.whatYouWillLearn,
															'',
														],
												  }
												: null
										);
									}}
								>
									<Plus className="h-4 w-4 mr-2" /> Add
									Learning Outcome
								</Button>
							</div>
							{formData.whatYouWillLearn.map((item, index) => (
								<div key={index} className="flex gap-2">
									<Input
										value={item}
										onChange={(e) => {
											const newWhatYouWillLearn = [
												...formData.whatYouWillLearn,
											];
											newWhatYouWillLearn[index] =
												e.target.value;
											setFormData((prev) =>
												prev
													? {
															...prev,
															whatYouWillLearn:
																newWhatYouWillLearn,
													  }
													: null
											);
										}}
										placeholder="Learning outcome"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => {
											const newWhatYouWillLearn =
												formData.whatYouWillLearn.filter(
													(_, i) => i !== index
												);
											setFormData((prev) =>
												prev
													? {
															...prev,
															whatYouWillLearn:
																newWhatYouWillLearn,
													  }
													: null
											);
										}}
										className="h-10 w-10"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>

						<Button
							type="submit"
							className="w-full gradient-bg hover:opacity-90"
							disabled={submitting}
						>
							{submitting ? 'Updating...' : 'Update Course'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
