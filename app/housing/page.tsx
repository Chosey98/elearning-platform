'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Search,
	Home,
	MapPin,
	Bed,
	Bath,
	Wifi,
	Tv,
	Utensils,
	Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface House {
	id: string;
	title: string;
	description: string;
	price: number;
	address: string;
	bedrooms: number;
	bathrooms: number;
	size: number;
	amenities: string[];
	type: string;
	available: boolean;
	images: string[];
	status: string;
	homeowner: {
		name: string | null;
	};
}

export default function HousingPage() {
	const [houses, setHouses] = useState<House[]>([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		type: 'all',
		priceRange: 'all',
		search: '',
	});

	useEffect(() => {
		const fetchHouses = async () => {
			try {
				const response = await fetch('/api/housing');
				if (!response.ok) throw new Error('Failed to fetch houses');
				const data = await response.json();
				setHouses(data.houses);
			} catch (error) {
				console.error('Error fetching houses:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchHouses();
	}, []);

	const filteredHouses = houses.filter((house) => {
		if (filters.type !== 'all' && house.type !== filters.type) return false;
		if (filters.priceRange !== 'all') {
			const [min, max] = filters.priceRange.split('-').map(Number);
			if (max && (house.price < min || house.price > max)) return false;
			if (!max && house.price < min) return false;
		}
		if (
			filters.search &&
			!house.title.toLowerCase().includes(filters.search.toLowerCase()) &&
			!house.address.toLowerCase().includes(filters.search.toLowerCase())
		)
			return false;
		return true;
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container mx-auto py-8 px-4">
				<h1 className="text-3xl font-bold mb-2 gradient-text">
					Find Your Perfect Home
				</h1>
				<p className="text-muted-foreground mb-8">
					Browse verified housing options near your educational
					institution
				</p>

				<div className="bg-white rounded-xl shadow-sm p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search by location, title..."
								className="pl-10 border-primary/20 focus-visible:ring-primary"
								value={filters.search}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										search: e.target.value,
									}))
								}
							/>
						</div>

						<div>
							<Select
								onValueChange={(value) =>
									setFilters((prev) => ({
										...prev,
										type: value,
									}))
								}
							>
								<SelectTrigger className="border-primary/20 focus:ring-primary">
									<SelectValue placeholder="Housing Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Types
									</SelectItem>
									<SelectItem value="apartment">
										Apartment
									</SelectItem>
									<SelectItem value="house">House</SelectItem>
									<SelectItem value="studio">
										Studio
									</SelectItem>
									<SelectItem value="shared">
										Shared
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Select
								onValueChange={(value) =>
									setFilters((prev) => ({
										...prev,
										priceRange: value,
									}))
								}
							>
								<SelectTrigger className="border-primary/20 focus:ring-primary">
									<SelectValue placeholder="Price Range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Prices
									</SelectItem>
									<SelectItem value="0-500">
										$0 - $500
									</SelectItem>
									<SelectItem value="500-750">
										$500 - $750
									</SelectItem>
									<SelectItem value="750-1000">
										$750 - $1000
									</SelectItem>
									<SelectItem value="1000">$1000+</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Tabs defaultValue="grid" className="mb-8">
					<div className="flex justify-between items-center">
						<p className="text-muted-foreground">
							Showing {filteredHouses.length} properties
						</p>
						<TabsList>
							<TabsTrigger value="grid">Grid</TabsTrigger>
							<TabsTrigger value="list">List</TabsTrigger>
						</TabsList>
					</div>

					{loading ? (
						<div className="flex items-center justify-center min-h-[400px]">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
						</div>
					) : (
						<>
							<TabsContent value="grid" className="mt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{filteredHouses.map((house) => (
										<Card
											key={house.id}
											className="overflow-hidden border-0 shadow-lg card-hover bg-white"
										>
											<div className="relative aspect-video">
												<img
													src={
														house.images &&
														house.images.length > 0
															? house.images[0]
															: '/placeholder.svg'
													}
													alt={house.title}
													className="w-full h-full object-cover"
												/>
												<Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
													${house.price}/month
												</Badge>
												<Badge className="absolute bottom-3 left-3 bg-white/90 text-secondary hover:bg-white/80">
													{house.type}
												</Badge>
												<Badge
													variant={
														house.status ===
														'available'
															? 'default'
															: 'secondary'
													}
													className="absolute top-3 right-3"
												>
													{house.status}
												</Badge>
											</div>
											<CardHeader>
												<div className="flex justify-between items-start">
													<div>
														<CardTitle className="text-xl">
															{house.title}
														</CardTitle>
														<CardDescription className="flex items-center mt-1">
															<MapPin className="h-4 w-4 mr-1" />
															{house.address}
														</CardDescription>
													</div>
												</div>
											</CardHeader>
											<CardContent>
												<div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
													<div className="flex items-center gap-1">
														<Bed className="h-4 w-4 text-muted-foreground" />
														<span>
															{house.bedrooms}{' '}
															{house.bedrooms ===
															1
																? 'Bedroom'
																: 'Bedrooms'}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Bath className="h-4 w-4 text-muted-foreground" />
														<span>
															{house.bathrooms}{' '}
															{house.bathrooms ===
															1
																? 'Bathroom'
																: 'Bathrooms'}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Home className="h-4 w-4 text-muted-foreground" />
														<span>
															{house.size} sqft
														</span>
													</div>
												</div>
												<div className="flex gap-4">
													<Button
														variant="outline"
														asChild
														className="flex-1"
													>
														<Link
															href={`/housing/${house.id}`}
														>
															View Details
														</Link>
													</Button>
													{house.status ===
														'available' && (
														<Button
															asChild
															className="flex-1"
														>
															<Link
																href={`/housing/${house.id}/rent`}
															>
																Rent Now
															</Link>
														</Button>
													)}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</TabsContent>

							<TabsContent value="list" className="mt-6">
								<div className="space-y-4">
									{filteredHouses.map((house) => (
										<Card
											key={house.id}
											className="overflow-hidden border-0 shadow-lg card-hover bg-white"
										>
											<div className="grid md:grid-cols-[300px,1fr] gap-6">
												<div className="relative h-48 md:h-full">
													<img
														src={
															house.images &&
															house.images
																.length > 0
																? house
																		.images[0]
																: '/placeholder.svg'
														}
														alt={house.title}
														className="w-full h-full object-cover"
													/>
													<Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
														${house.price}/month
													</Badge>
													<Badge className="absolute bottom-3 left-3 bg-white/90 text-secondary hover:bg-white/80">
														{house.type}
													</Badge>
													<Badge
														variant={
															house.status ===
															'available'
																? 'default'
																: 'secondary'
														}
														className="absolute top-3 right-3"
													>
														{house.status}
													</Badge>
												</div>
												<div className="p-6">
													<h3 className="text-xl font-semibold mb-2">
														{house.title}
													</h3>
													<div className="flex items-center gap-1 text-muted-foreground mb-4">
														<MapPin className="h-4 w-4" />
														{house.address}
													</div>
													<p className="text-sm text-gray-500 mb-4">
														{house.description}
													</p>
													<div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
														<div className="flex items-center gap-1">
															<Bed className="h-4 w-4 text-muted-foreground" />
															<span>
																{house.bedrooms}{' '}
																{house.bedrooms ===
																1
																	? 'Bedroom'
																	: 'Bedrooms'}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<Bath className="h-4 w-4 text-muted-foreground" />
															<span>
																{
																	house.bathrooms
																}{' '}
																{house.bathrooms ===
																1
																	? 'Bathroom'
																	: 'Bathrooms'}
															</span>
														</div>
														<div className="flex items-center gap-1">
															<Home className="h-4 w-4 text-muted-foreground" />
															<span>
																{house.size}{' '}
																sqft
															</span>
														</div>
													</div>
													<div className="flex gap-4">
														<Button
															variant="outline"
															asChild
															className="flex-1"
														>
															<Link
																href={`/housing/${house.id}`}
															>
																View Details
															</Link>
														</Button>
														{house.status ===
															'available' && (
															<Button
																asChild
																className="flex-1"
															>
																<Link
																	href={`/housing/${house.id}/rent`}
																>
																	Rent Now
																</Link>
															</Button>
														)}
													</div>
												</div>
											</div>
										</Card>
									))}
								</div>
							</TabsContent>
						</>
					)}
				</Tabs>
			</div>
		</div>
	);
}
