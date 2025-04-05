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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
	Home,
	Trash2,
	Save,
	MapPin,
	Bed,
	Bath,
	Calendar,
	Edit,
	ArrowLeft,
	Heart,
	Share,
	CheckCircle,
} from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Map from '@/components/Map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface House {
	id: string;
	title: string;
	description: string;
	address: string;
	latitude?: number;
	longitude?: number;
	price: number;
	bedrooms: number;
	bathrooms: number;
	size: number;
	amenities: string[];
	images: string[];
	status: string;
	type: string;
	homeowner: {
		id: string;
		name: string | null;
		email?: string | null;
	};
	rental?: {
		id: string;
		startDate: Date;
		endDate: Date;
		renter: {
			name: string;
			email: string;
		};
	};
}

export default function HouseDetailPage({
	params,
}: {
	params: { houseId: string };
}) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const [house, setHouse] = useState<House | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isFavorited, setIsFavorited] = useState(false);

	useEffect(() => {
		fetchHouse();
	}, [params.houseId]);

	// Check favorite status
	useEffect(() => {
		const checkFavoriteStatus = async () => {
			try {
				const response = await fetch(
					`/api/housing/${params.houseId}/favorite`
				);
				if (response.ok) {
					const data = await response.json();
					setIsFavorited(data.isFavorited);
				}
			} catch (error) {
				console.error('Error checking favorite status:', error);
			}
		};

		if (session?.user) {
			checkFavoriteStatus();
		}
	}, [params.houseId, session?.user]);

	// Handle favorite toggle
	const handleFavoriteToggle = async () => {
		if (!session?.user) {
			toast({
				title: 'Authentication Required',
				description: 'Please log in to save properties.',
				variant: 'destructive',
			});
			router.push('/login');
			return;
		}

		try {
			const response = await fetch(
				`/api/housing/${params.houseId}/favorite`,
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
					? 'This property has been added to your favorites.'
					: 'This property has been removed from your favorites.',
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
					title: house?.title || 'Property',
					text: house?.description || '',
					url: window.location.href,
				});
				toast({
					title: 'Shared Successfully',
					description: 'Property has been shared.',
				});
			} else {
				await navigator.clipboard.writeText(window.location.href);
				toast({
					title: 'Link Copied',
					description: 'Property link has been copied to clipboard.',
				});
			}
		} catch (error) {
			console.error('Error sharing property:', error);
			// Always try to fall back to clipboard
			try {
				await navigator.clipboard.writeText(window.location.href);
				toast({
					title: 'Link Copied',
					description: 'Property link has been copied to clipboard.',
				});
			} catch (clipboardError) {
				toast({
					title: 'Error',
					description: 'Failed to share or copy property link.',
					variant: 'destructive',
				});
			}
		}
	};

	// Handle payment success and create rental
	useEffect(() => {
		const handlePaymentSuccess = async () => {
			const searchParams = new URLSearchParams(window.location.search);
			const success = searchParams.get('success');
			const houseId = searchParams.get('houseId');
			const startDate = searchParams.get('startDate');
			const endDate = searchParams.get('endDate');

			if (
				success === 'true' &&
				houseId === params.houseId &&
				startDate &&
				endDate
			) {
				try {
					const response = await fetch(
						`/api/housing/${params.houseId}/rent`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								startDate,
								endDate,
							}),
						}
					);

					if (!response.ok) {
						throw new Error('Failed to create rental');
					}

					const data = await response.json();
					toast({
						title: 'Success',
						description:
							'Property rented successfully! You can now move in on the start date.',
					});

					// Refresh the house data to show updated status
					fetchHouse();

					// Remove query parameters
					window.history.replaceState(
						{},
						'',
						`/housing/${params.houseId}`
					);
				} catch (error) {
					console.error('Error creating rental:', error);
					toast({
						title: 'Error',
						description: 'Failed to complete rental process',
						variant: 'destructive',
					});
				}
			}
		};

		handlePaymentSuccess();
	}, [params.houseId, toast]);

	const fetchHouse = async () => {
		try {
			const response = await fetch(`/api/housing/${params.houseId}`);
			if (!response.ok) throw new Error('Failed to fetch house');
			const data = await response.json();
			setHouse(data);
		} catch (error) {
			console.error('Error fetching house:', error);
			toast({
				title: 'Error',
				description: 'Failed to fetch house details',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSaveProperty = () => {
		toast({
			title: 'Property Saved',
			description: 'This property has been added to your saved list',
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!house) {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>House Not Found</CardTitle>
						<CardDescription>
							The house you're looking for doesn't exist.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/housing')}>
							Back to Listings
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isOwner = session?.user?.id === house.homeowner.id;

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
			<div className="container mx-auto py-8 px-4">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
					</Button>

					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold gradient-text">
								{house.title}
							</h1>
							<div className="flex items-center text-muted-foreground mt-1">
								<MapPin className="h-4 w-4 mr-1" />
								{house.address}
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
							{isOwner && (
								<Link href={`/housing/${house.id}/manage`}>
									<Button>
										<Edit className="mr-2 h-4 w-4" /> Edit
										Property
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* Image Gallery */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<div className="md:col-span-2 md:row-span-2">
						<img
							src={house.images[0]}
							alt={house.title}
							className="w-full h-full object-cover rounded-lg"
						/>
					</div>
					{house.images.slice(1, 4).map((image, index) => (
						<div key={index}>
							<img
								src={image}
								alt={`${house.title} - image ${index + 2}`}
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<Tabs defaultValue="details">
							<TabsList className="mb-4">
								<TabsTrigger value="details">
									Details
								</TabsTrigger>
								<TabsTrigger value="amenities">
									Amenities
								</TabsTrigger>
								<TabsTrigger value="location">
									Location
								</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Property Overview</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p className="text-gray-600">
											{house.description}
										</p>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
											<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
												<Bed className="h-6 w-6 text-primary mb-2" />
												<span className="text-sm text-gray-500">
													Bedrooms
												</span>
												<span className="font-bold">
													{house.bedrooms}
												</span>
											</div>
											<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
												<Bath className="h-6 w-6 text-primary mb-2" />
												<span className="text-sm text-gray-500">
													Bathrooms
												</span>
												<span className="font-bold">
													{house.bathrooms}
												</span>
											</div>
											<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
												<Home className="h-6 w-6 text-primary mb-2" />
												<span className="text-sm text-gray-500">
													Size
												</span>
												<span className="font-bold">
													{house.size} sqft
												</span>
											</div>
											<div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
												<Calendar className="h-6 w-6 text-primary mb-2" />
												<span className="text-sm text-gray-500">
													Status
												</span>
												<span className="font-bold capitalize">
													{house.status}
												</span>
											</div>
										</div>

										<div className="pt-4">
											<h3 className="font-bold mb-2">
												Property Details
											</h3>
											<div className="space-y-2">
												<div>
													<span className="text-sm text-muted-foreground">
														Type
													</span>
													<p className="font-medium capitalize">
														{house.type}
													</p>
												</div>
												<div>
													<span className="text-sm text-muted-foreground">
														Listed by
													</span>
													<p className="font-medium">
														{house.homeowner.name}
													</p>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{isOwner && house.rental && (
									<Card>
										<CardHeader>
											<CardTitle>
												Current Rental
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												<div className="flex items-center text-sm">
													<Calendar className="h-4 w-4 mr-2" />
													{new Date(
														house.rental.startDate
													).toLocaleDateString()}{' '}
													-{' '}
													{new Date(
														house.rental.endDate
													).toLocaleDateString()}
												</div>
												<p className="text-sm">
													Rented to:{' '}
													{house.rental.renter.name}
												</p>
												<p className="text-sm">
													Contact:{' '}
													{house.rental.renter.email}
												</p>
											</div>
										</CardContent>
									</Card>
								)}
							</TabsContent>

							<TabsContent value="amenities">
								<Card>
									<CardHeader>
										<CardTitle>
											Amenities & Features
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{house.amenities.map(
												(amenity, index) => (
													<div
														key={index}
														className="flex items-center gap-2"
													>
														<CheckCircle className="h-5 w-5 text-primary" />
														<span>{amenity}</span>
													</div>
												)
											)}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="location">
								<Card>
									<CardHeader>
										<CardTitle>Location</CardTitle>
										<CardDescription>
											{house.address}
										</CardDescription>
									</CardHeader>
									<CardContent>
										{house.latitude && house.longitude ? (
											<div className="aspect-video rounded-lg overflow-hidden">
												<Map
													latitude={house.latitude}
													longitude={house.longitude}
													zoom={15}
													className="w-full h-full"
												/>
											</div>
										) : (
											<div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
												<p className="text-gray-500">
													Location not available
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<Card className="border-0 shadow-lg overflow-hidden">
							<div className="h-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
							<CardHeader>
								<CardTitle className="text-2xl font-bold">
									${house.price}
									<span className="text-base font-normal text-gray-500">
										/month
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="w-full space-y-2">
									{house.status === 'available' && (
										<Button
											className="w-full gradient-bg hover:opacity-90 transition-opacity"
											asChild
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

						<Card>
							<CardHeader>
								<CardTitle>Listed By</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center">
									<div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
									<div>
										<h3 className="font-bold">
											{house.homeowner.name}
										</h3>
										<p className="text-sm text-gray-500">
											Property Owner
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
