'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	User,
	Home,
	Calendar,
	GraduationCap,
	BookOpen,
	UserCog,
	Building,
	Heart,
	ArrowRight,
	MapPin,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface Course {
	id: string;
	title: string;
	description: string;
	imageUrl: string | null;
	instructor: {
		name: string;
	};
}

interface House {
	id: string;
	title: string;
	description: string;
	address: string;
	price: number;
	images: string[];
	homeowner: {
		name: string;
	};
	startDate: string;
	endDate: string | null;
}

interface Stats {
	enrolledCourses: Course[];
	favoriteCourses: Course[];
	rentedHouses: House[];
	favoriteHouses: House[];
	totalEnrolled: number;
	totalFavorites: number;
	totalRented: number;
	totalFavoriteHouses: number;
}

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [stats, setStats] = useState<Stats>({
		enrolledCourses: [],
		favoriteCourses: [],
		rentedHouses: [],
		favoriteHouses: [],
		totalEnrolled: 0,
		totalFavorites: 0,
		totalRented: 0,
		totalFavoriteHouses: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
			return;
		}

		const fetchUserStats = async () => {
			try {
				const response = await fetch('/api/user/stats');
				if (response.ok) {
					const data = await response.json();
					setStats(data);
				}
			} catch (error) {
				console.error('Error fetching user stats:', error);
			} finally {
				setLoading(false);
			}
		};

		if (session?.user) {
			fetchUserStats();
		}
	}, [status, session, router]);

	if (status === 'loading' || loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Don't render anything during redirects
	if (
		status === 'unauthenticated' ||
		session?.user?.role === 'instructor' ||
		session?.user?.role === 'homeowner'
	) {
		return null;
	}

	// This is the student dashboard
	return (
		<div className="container py-10">
			<h1 className="text-3xl font-bold mb-8 gradient-text">
				Welcome, {session?.user?.name || 'Student'}
			</h1>

			<div className="grid gap-4 md:grid-cols-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							My Courses
						</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalEnrolled}
						</div>
						<p className="text-xs text-muted-foreground">
							Enrolled courses
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							My Favorites
						</CardTitle>
						<Heart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalFavorites}
						</div>
						<p className="text-xs text-muted-foreground">
							Favorite courses
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							My Rentals
						</CardTitle>
						<Building className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalRented}
						</div>
						<p className="text-xs text-muted-foreground">
							Rented properties
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Account
						</CardTitle>
						<User className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-sm font-medium truncate">
							{session?.user?.email}
						</div>
						<p className="text-xs text-muted-foreground">
							Student account
						</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="enrolled" className="space-y-6">
				<TabsList>
					<TabsTrigger value="enrolled">My Courses</TabsTrigger>
					<TabsTrigger value="favorites">Favorites</TabsTrigger>
					<TabsTrigger value="rentals">My Rentals</TabsTrigger>
				</TabsList>

				<TabsContent value="enrolled" className="space-y-4">
					{stats.enrolledCourses.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{stats.enrolledCourses.map((course) => (
								<Card key={course.id}>
									<CardHeader>
										<CardTitle className="text-lg">
											{course.title}
										</CardTitle>
										<CardDescription>
											{course.description}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between items-center">
											<span className="text-sm text-muted-foreground">
												By {course.instructor.name}
											</span>
											<Link
												href={`/courses/${course.id}`}
											>
												<Button
													variant="ghost"
													size="sm"
												>
													Continue Learning
													<ArrowRight className="ml-2 h-4 w-4" />
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">
								No Enrolled Courses
							</h3>
							<p className="text-muted-foreground mb-4">
								You haven't enrolled in any courses yet.
							</p>
							<Link href="/courses">
								<Button>Browse Courses</Button>
							</Link>
						</div>
					)}
				</TabsContent>

				<TabsContent value="favorites" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h2 className="text-xl font-semibold mb-4">
								Favorite Courses
							</h2>
							{stats.favoriteCourses.length > 0 ? (
								<div className="grid gap-4">
									{stats.favoriteCourses.map((course) => (
										<Card key={course.id}>
											<CardHeader>
												<CardTitle className="text-lg">
													{course.title}
												</CardTitle>
												<CardDescription>
													{course.description}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex justify-between items-center">
													<span className="text-sm text-muted-foreground">
														By{' '}
														{course.instructor.name}
													</span>
													<Link
														href={`/courses/${course.id}`}
													>
														<Button
															variant="ghost"
															size="sm"
														>
															View Course
															<ArrowRight className="ml-2 h-4 w-4" />
														</Button>
													</Link>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<Card>
									<CardHeader>
										<CardTitle>
											No Favorite Courses
										</CardTitle>
										<CardDescription>
											You haven't favorited any courses
											yet.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href="/courses">
											<Button>Browse Courses</Button>
										</Link>
									</CardContent>
								</Card>
							)}
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-4">
								Favorite Properties
							</h2>
							{stats.favoriteHouses &&
							stats.favoriteHouses.length > 0 ? (
								<div className="grid gap-4">
									{stats.favoriteHouses.map((house) => (
										<Card key={house.id}>
											<div className="aspect-video relative overflow-hidden rounded-t-lg">
												<img
													src={house.images[0]}
													alt={house.title}
													className="object-cover w-full h-full"
												/>
											</div>
											<CardHeader>
												<CardTitle className="text-lg">
													{house.title}
												</CardTitle>
												<CardDescription className="flex items-center gap-1">
													<MapPin className="h-4 w-4" />
													{house.address}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<div className="flex justify-between items-center">
													<span className="text-sm text-muted-foreground">
														${house.price}/month
													</span>
													<Link
														href={`/housing/${house.id}`}
													>
														<Button
															variant="ghost"
															size="sm"
														>
															View Property
															<ArrowRight className="ml-2 h-4 w-4" />
														</Button>
													</Link>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<Card>
									<CardHeader>
										<CardTitle>
											No Favorite Properties
										</CardTitle>
										<CardDescription>
											You haven't favorited any properties
											yet.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href="/housing">
											<Button>Browse Properties</Button>
										</Link>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="rentals" className="space-y-4">
					{stats.rentedHouses?.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{stats.rentedHouses.map((house) => (
								<Card key={house.id}>
									<div className="aspect-video relative overflow-hidden rounded-t-lg">
										<img
											src={house.images[0]}
											alt={house.title}
											className="object-cover w-full h-full"
										/>
									</div>
									<CardHeader>
										<CardTitle className="text-lg">
											{house.title}
										</CardTitle>
										<CardDescription className="flex items-center gap-1">
											<MapPin className="h-4 w-4" />
											{house.address}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">
													Owner
												</span>
												<span className="font-medium">
													{house.homeowner.name}
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">
													Rent
												</span>
												<span className="font-medium">
													${house.price}/month
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-sm text-muted-foreground">
													Period
												</span>
												<span className="font-medium">
													{new Date(
														house.startDate
													).toLocaleDateString()}{' '}
													-{' '}
													{house.endDate
														? new Date(
																house.endDate
														  ).toLocaleDateString()
														: 'Ongoing'}
												</span>
											</div>
											<Link
												href={`/housing/${house.id}`}
												className="block mt-4"
											>
												<Button
													variant="outline"
													className="w-full"
												>
													View Property
													<ArrowRight className="ml-2 h-4 w-4" />
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">
								No Rented Properties
							</h3>
							<p className="text-muted-foreground mb-4">
								You haven't rented any properties yet.
							</p>
							<Link href="/housing">
								<Button>Browse Properties</Button>
							</Link>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
