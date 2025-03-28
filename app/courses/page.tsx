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

// Mock course data
const COURSES = [
	{
		id: 1,
		title: 'Introduction to Frontend Development',
		description:
			'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
		level: 'Beginner',
		duration: '8 weeks',
		instructor: 'Sarah Johnson',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Web Development',
		color: 'from-purple-500 to-pink-500',
	},
	{
		id: 2,
		title: 'Advanced React Patterns',
		description:
			'Master advanced React concepts including hooks, context, and performance optimization.',
		level: 'Advanced',
		duration: '6 weeks',
		instructor: 'Michael Chen',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Frontend',
		color: 'from-blue-500 to-cyan-500',
	},
	{
		id: 3,
		title: 'Data Science Fundamentals',
		description:
			'Introduction to data analysis, visualization, and machine learning basics.',
		level: 'Intermediate',
		duration: '10 weeks',
		instructor: 'Emily Rodriguez',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Data Science',
		color: 'from-green-500 to-teal-500',
	},
	{
		id: 4,
		title: 'Mobile App Development with Flutter',
		description:
			'Build cross-platform mobile applications with Flutter and Dart.',
		level: 'Intermediate',
		duration: '8 weeks',
		instructor: 'David Kim',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Mobile Development',
		color: 'from-orange-500 to-amber-500',
	},
	{
		id: 5,
		title: 'Python for Beginners',
		description:
			'Start your programming journey with Python, one of the most popular programming languages.',
		level: 'Beginner',
		duration: '6 weeks',
		instructor: 'Alex Thompson',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Programming',
		color: 'from-yellow-500 to-amber-500',
	},
	{
		id: 6,
		title: 'UX/UI Design Principles',
		description:
			'Learn the fundamentals of user experience and interface design to create beautiful, functional products.',
		level: 'Beginner',
		duration: '7 weeks',
		instructor: 'Jessica Lee',
		image: '/placeholder.svg?height=200&width=300',
		category: 'Design',
		color: 'from-pink-500 to-rose-500',
	},
];

export default function CoursesPage() {
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
					{COURSES.map((course) => (
						<Card
							key={course.id}
							className="overflow-hidden border-0 shadow-lg card-hover bg-white"
						>
							<div
								className={`h-3 w-full bg-gradient-to-r ${course.color}`}
							></div>
							<div className="relative">
								<img
									src={course.image || '/placeholder.svg'}
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
								<p className="text-sm text-gray-500">
									{course.description}
								</p>
								<div className="flex items-center gap-2 mt-4">
									<User className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										{course.instructor}
									</p>
								</div>
								<div className="flex items-center gap-2 mt-1">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										{course.duration}
									</p>
								</div>
							</CardContent>
							<CardFooter>
								<Link
									href={`/courses/${course.id}`}
									className="w-full"
								>
									<Button className="w-full gradient-bg hover:opacity-90 transition-opacity">
										View Course
									</Button>
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
