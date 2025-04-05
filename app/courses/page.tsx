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
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Search, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getCourses() {
	try {
		console.log('Fetching all courses');
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

		console.log(
			'Raw courses from database:',
			JSON.stringify(courses, null, 2)
		);

		return courses.map((course) => {
			try {
				return {
					...course,
					syllabus: course.syllabus
						? JSON.parse(course.syllabus)
						: [],
					requirements: course.requirements
						? JSON.parse(course.requirements)
						: [],
					whatYouWillLearn: course.whatYouWillLearn
						? JSON.parse(course.whatYouWillLearn)
						: [],
				};
			} catch (error) {
				console.error(
					`Error parsing JSON fields for course ${course.id}:`,
					error
				);
				return {
					...course,
					syllabus: [],
					requirements: [],
					whatYouWillLearn: [],
				};
			}
		});
	} catch (error) {
		console.error('Error fetching courses:', error);
		return [];
	}
}

export default async function CoursesPage() {
	const courses = await getCourses();
	console.log(
		'Processed courses for display:',
		JSON.stringify(courses, null, 2)
	);

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container mx-auto py-8 px-4">
				<h1 className="text-3xl font-bold mb-2 gradient-text">
					Explore Courses
				</h1>
				<p className="text-muted-foreground mb-8">
					Discover our wide range of courses to enhance your skills
				</p>

				<div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search courses..."
							className="pl-10 border-primary/20 focus-visible:ring-primary"
						/>
					</div>
					<div className="w-full md:w-48">
						<Select>
							<SelectTrigger className="border-primary/20 focus:ring-primary">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Categories
								</SelectItem>
								<SelectItem value="web-development">
									Web Development
								</SelectItem>
								<SelectItem value="frontend">
									Frontend
								</SelectItem>
								<SelectItem value="data-science">
									Data Science
								</SelectItem>
								<SelectItem value="mobile-development">
									Mobile Development
								</SelectItem>
								<SelectItem value="programming">
									Programming
								</SelectItem>
								<SelectItem value="design">Design</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="w-full md:w-48">
						<Select>
							<SelectTrigger className="border-primary/20 focus:ring-primary">
								<SelectValue placeholder="Level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="beginner">
									Beginner
								</SelectItem>
								<SelectItem value="intermediate">
									Intermediate
								</SelectItem>
								<SelectItem value="advanced">
									Advanced
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{courses.map((course) => (
						<Link
							href={`/courses/${course.id}`}
							key={course.id}
							className="block"
						>
							<Card className="overflow-hidden border-0 shadow-lg card-hover bg-white transition-transform hover:scale-[1.02]">
								<div className="h-3 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
								<div className="relative">
									<img
										src={
											course.imageUrl ||
											'/placeholder.svg'
										}
										alt={course.title}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
									<Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
										{course.level}
									</Badge>
								</div>
								<CardHeader>
									<div className="flex justify-between items-start">
										<CardTitle className="text-xl">
											{course.title}
										</CardTitle>
									</div>
									<CardDescription className="flex items-center gap-1">
										<span className="text-secondary font-medium">
											{course.category}
										</span>{' '}
										• {course.duration}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500 mb-4">
										{course.description}
									</p>
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{course.duration}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{course.instructor.name}
											</span>
										</div>
									</div>
								</CardContent>
								<CardFooter>
									<Button className="w-full gradient-bg hover:opacity-90">
										View Course
									</Button>
								</CardFooter>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
