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
import { useToast } from '@/components/ui/use-toast';
import {
	Home,
	Users,
	DollarSign,
	TrendingUp,
	Calendar,
	AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Property {
	id: string;
	title: string;
	description: string;
	price: number;
	location: string;
	images: string[];
	status: string;
	currentRental?: {
		id: string;
		startDate: Date;
		endDate: Date;
		renter: {
			name: string;
			email: string;
		};
	};
}

interface Analytics {
	totalProperties: number;
	availableProperties: number;
	rentedProperties: number;
	totalRevenue: number;
	occupancyRate: number;
	upcomingRenewals: number;
}

export default function HomeownerDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [properties, setProperties] = useState<Property[]>([]);
	const [analytics, setAnalytics] = useState<Analytics>({
		totalProperties: 0,
		availableProperties: 0,
		rentedProperties: 0,
		totalRevenue: 0,
		occupancyRate: 0,
		upcomingRenewals: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login');
		} else if (status === 'authenticated') {
			if (session?.user?.role !== 'homeowner') {
				router.push('/dashboard');
			} else {
				fetchProperties();
			}
		}
	}, [status, session, router]);

	const fetchProperties = async () => {
		try {
			const response = await fetch('/api/housing');
			if (!response.ok) throw new Error('Failed to fetch properties');
			const data = await response.json();
			setProperties(data.houses);

			// Calculate analytics
			const rentedProps = data.houses.filter(
				(p: Property) => p.status === 'rented'
			);
			const analytics: Analytics = {
				totalProperties: data.houses.length,
				availableProperties: data.houses.filter(
					(p: Property) => p.status === 'available'
				).length,
				rentedProperties: rentedProps.length,
				totalRevenue: rentedProps.reduce(
					(acc: number, curr: Property) => acc + curr.price,
					0
				),
				occupancyRate: (rentedProps.length / data.houses.length) * 100,
				upcomingRenewals: rentedProps.filter((p: Property) => {
					if (!p.currentRental?.endDate) return false;
					const endDate = new Date(p.currentRental.endDate);
					const thirtyDaysFromNow = new Date();
					thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
					return endDate <= thirtyDaysFromNow;
				}).length,
			};
			setAnalytics(analytics);
		} catch (error) {
			console.error('Error fetching properties:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold gradient-text">
						Homeowner Dashboard
					</h1>
					<p className="text-muted-foreground">
						Manage your properties and view analytics
					</p>
				</div>
				<Link href="/housing/add">
					<Button className="gradient-bg hover:opacity-90 transition-opacity">
						<Home className="mr-2 h-4 w-4" /> Add New Property
					</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Properties
						</CardTitle>
						<Home className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.totalProperties}
						</div>
						<p className="text-xs text-muted-foreground">
							{analytics.availableProperties} available,{' '}
							{analytics.rentedProperties} rented
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Monthly Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${analytics.totalRevenue}
						</div>
						<p className="text-xs text-muted-foreground">
							From {analytics.rentedProperties} rented properties
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Occupancy Rate
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{analytics.occupancyRate.toFixed(1)}%
						</div>
						<p className="text-xs text-muted-foreground">
							{analytics.upcomingRenewals} renewals due in 30 days
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-bold">Your Properties</h2>
				</div>

				{properties.length === 0 ? (
					<Card>
						<CardHeader>
							<CardTitle>No Properties Yet</CardTitle>
							<CardDescription>
								Start by adding your first property to manage
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Link href="/housing/add">
								<Button>
									<Home className="mr-2 h-4 w-4" /> Add
									Property
								</Button>
							</Link>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{properties.map((property) => (
							<Card key={property.id} className="overflow-hidden">
								<div className="relative">
									<img
										src={
											property.images &&
											property.images.length > 0
												? property.images[0]
												: '/placeholder.svg'
										}
										alt={property.title}
										className="w-full h-48 object-cover"
									/>
									<div
										className={`absolute top-2 right-2 px-2 py-1 rounded text-sm ${
											property.status === 'available'
												? 'bg-green-100 text-green-800'
												: 'bg-blue-100 text-blue-800'
										}`}
									>
										{property.status}
									</div>
								</div>
								<CardHeader>
									<CardTitle>{property.title}</CardTitle>
									<CardDescription>
										{property.location}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">
												Price
											</span>
											<span className="font-medium">
												${property.price}/month
											</span>
										</div>
										{property.currentRental && (
											<div className="space-y-1">
												<div className="flex items-center text-sm text-muted-foreground">
													<Users className="mr-2 h-4 w-4" />
													Rented to{' '}
													{
														property.currentRental
															.renter.name
													}
												</div>
												<div className="flex items-center text-sm text-muted-foreground">
													<Calendar className="mr-2 h-4 w-4" />
													Until{' '}
													{new Date(
														property.currentRental.endDate
													).toLocaleDateString()}
												</div>
											</div>
										)}
									</div>
								</CardContent>
								<div className="p-6 pt-0">
									<Link href={`/housing/${property.id}`}>
										<Button className="w-full">
											Manage Property
										</Button>
									</Link>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
