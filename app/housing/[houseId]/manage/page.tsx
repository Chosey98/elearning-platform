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
import { Home, Trash2, Save, Plus, X } from 'lucide-react';
import AddressPicker from '@/components/AddressPicker';
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
import Map from '@/components/Map';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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
	homeownerId: string;
	currentRental?: {
		id: string;
		startDate: string;
		endDate: string | null;
		renter: {
			name: string;
			email: string;
		};
	};
}

// Common amenities list
const AMENITIES = [
	'WiFi',
	'TV',
	'Kitchen',
	'Washer',
	'Dryer',
	'Air Conditioning',
	'Heating',
	'Parking',
	'Pool',
	'Gym',
	'Elevator',
	'Security',
	'Balcony',
	'Garden',
	'Pets Allowed',
];

export default function ManageHousePage({
	params,
}: {
	params: { houseId: string };
}) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [house, setHouse] = useState<House | null>(null);
	const [formData, setFormData] = useState<Partial<House>>({});
	const [newImages, setNewImages] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

	useEffect(() => {
		if (status === 'unauthenticated') {
			console.log('User is not authenticated');
			router.push('/login');
		} else if (status === 'authenticated') {
			console.log('User is authenticated:', session);
			fetchHouse();
		}
	}, [status, params.houseId]);

	useEffect(() => {
		if (house?.latitude && house?.longitude) {
			setCoordinates({ lat: house.latitude, lng: house.longitude });
		}
		if (house?.amenities) {
			setSelectedAmenities(house.amenities);
		}
	}, [house]);

	const fetchHouse = async () => {
		try {
			console.log('Fetching house data for ID:', params.houseId);
			const response = await fetch(`/api/housing/${params.houseId}`);
			if (!response.ok) throw new Error('Failed to fetch house');
			const data = await response.json();
			console.log('Fetched house data:', data);
			console.log('Current rental:', data.currentRental);
			console.log('House status:', data.status);
			setHouse(data);
			setFormData(data);
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

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!e.target.files?.length) return;
		const files = Array.from(e.target.files);
		setNewImages((prev) => [...prev, ...files]);

		// Create previews for new images
		const newPreviews = files.map((file) => URL.createObjectURL(file));
		setImagePreviews((prev) => [...prev, ...newPreviews]);
	};

	const toggleAmenity = (amenity: string) => {
		setSelectedAmenities((prev) =>
			prev.includes(amenity)
				? prev.filter((a) => a !== amenity)
				: [...prev, amenity]
		);
		setFormData((prev) => ({
			...prev,
			amenities: selectedAmenities.includes(amenity)
				? selectedAmenities.filter((a) => a !== amenity)
				: [...selectedAmenities, amenity],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUploading(true);

		try {
			// Upload new images if any
			const uploadedImageUrls = [];
			for (const image of newImages) {
				const formData = new FormData();
				formData.append('file', image);

				const uploadResponse = await fetch('/api/housing/upload', {
					method: 'POST',
					body: formData,
				});

				if (!uploadResponse.ok) {
					throw new Error('Failed to upload image');
				}

				const { url } = await uploadResponse.json();
				uploadedImageUrls.push(url);
			}

			// Combine existing and new images
			const updatedImages = [
				...(formData.images || []),
				...uploadedImageUrls,
			];

			// Update house data
			const response = await fetch(`/api/housing/${params.houseId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					images: updatedImages,
					amenities: selectedAmenities,
					price: parseFloat(formData.price?.toString() || '0'),
					bedrooms: parseInt(formData.bedrooms?.toString() || '0'),
					bathrooms: parseInt(formData.bathrooms?.toString() || '0'),
					size: parseFloat(formData.size?.toString() || '0'),
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update house');
			}

			// Clear previews and new images after successful upload
			setNewImages([]);
			setImagePreviews([]);

			toast({
				title: 'Success',
				description: 'House updated successfully',
			});

			// Refresh the house data
			fetchHouse();
		} catch (error) {
			console.error('Error updating house:', error);
			toast({
				title: 'Error',
				description: 'Failed to update house',
				variant: 'destructive',
			});
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/housing/${params.houseId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Failed to delete house');
			}

			toast({
				title: 'Success',
				description: 'House deleted successfully',
			});

			router.push('/dashboard/homeowner');
		} catch (error) {
			console.error('Error deleting house:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete house',
				variant: 'destructive',
			});
		}
	};

	const handleEndRental = async () => {
		try {
			const response = await fetch(
				`/api/housing/${params.houseId}/rent`,
				{
					method: 'DELETE',
				}
			);

			if (!response.ok) {
				throw new Error('Failed to end rental');
			}

			toast({
				title: 'Rental ended successfully',
				description: 'The tenant can now leave a review.',
			});

			// Refresh the page to show updated status
			router.refresh();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to end the rental. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddressChange = (
		address: string,
		lat?: number,
		lng?: number
	) => {
		setFormData((prev) => ({
			...prev,
			address,
			latitude: lat,
			longitude: lng,
		}));
		if (lat && lng) {
			setCoordinates({ lat, lng });
		}
	};

	const removeImage = (index: number, isNewImage: boolean) => {
		if (isNewImage) {
			// Remove from new images and previews
			setNewImages((prev) => prev.filter((_, i) => i !== index));
			setImagePreviews((prev) => prev.filter((_, i) => i !== index));
		} else {
			// Remove from existing images
			setFormData((prev) => ({
				...prev,
				images: prev.images?.filter((_, i) => i !== index),
			}));
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!house || !session?.user) {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
						<CardDescription>
							{!house
								? "The house you're looking for doesn't exist"
								: "You don't have permission to view this page"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => router.push('/dashboard/homeowner')}
						>
							Back to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Check if the current user is the homeowner
	const isHomeowner = house.homeownerId === session.user.id;

	if (!isHomeowner) {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
						<CardDescription>
							You don't have permission to manage this property.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={() => router.push('/dashboard/homeowner')}
						>
							Back to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="space-y-1">
						<CardTitle>Manage Property</CardTitle>
						<CardDescription>
							Update your property details
						</CardDescription>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								<Trash2 className="w-4 h-4 mr-2" />
								Delete Property
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you sure you want to delete this
									property?
								</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will
									permanently delete your property listing.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDelete}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="title">Property Title</Label>
								<Input
									id="title"
									name="title"
									value={formData.title || ''}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="address">
									Property Address
								</Label>
								<AddressPicker
									value={formData.address || ''}
									onChange={handleAddressChange}
									required
								/>
								{coordinates && (
									<div className="mt-2 rounded-md overflow-hidden border h-[200px]">
										<Map
											latitude={coordinates.lat}
											longitude={coordinates.lng}
											zoom={15}
											className="w-full h-full"
										/>
									</div>
								)}
							</div>

							<div className="grid gap-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									name="description"
									value={formData.description || ''}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="price">
										Price ($/month)
									</Label>
									<Input
										id="price"
										name="price"
										type="number"
										value={formData.price || ''}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="bedrooms">Bedrooms</Label>
									<Input
										id="bedrooms"
										name="bedrooms"
										type="number"
										value={formData.bedrooms || ''}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<Input
										id="bathrooms"
										name="bathrooms"
										type="number"
										value={formData.bathrooms || ''}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="size">Size (sq ft)</Label>
									<Input
										id="size"
										name="size"
										type="number"
										value={formData.size || ''}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												status: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="available">
												Available
											</SelectItem>
											<SelectItem value="rented">
												Rented
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="type">Property Type</Label>
									<Select
										value={formData.type}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												type: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="apartment">
												Apartment
											</SelectItem>
											<SelectItem value="house">
												House
											</SelectItem>
											<SelectItem value="studio">
												Studio
											</SelectItem>
											<SelectItem value="shared">
												Shared
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{(formData.status === 'rented' ||
								formData.currentRental) && (
								<div className="mt-4">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive">
												End Rental
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													End Rental
												</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to end
													this rental? This will mark
													the property as available
													and allow the tenant to
													leave a rating.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleEndRental}
												>
													End Rental
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							)}

							<div className="grid gap-2">
								<Label>Amenities</Label>
								<div className="flex flex-wrap gap-2">
									{AMENITIES.map((amenity) => (
										<Badge
											key={amenity}
											variant={
												selectedAmenities.includes(
													amenity
												)
													? 'default'
													: 'outline'
											}
											className="cursor-pointer hover:bg-primary/90"
											onClick={() =>
												toggleAmenity(amenity)
											}
										>
											{amenity}
										</Badge>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Images
								</label>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									{/* Existing Images */}
									{formData.images?.map((image, index) => (
										<div
											key={`existing-${index}`}
											className="relative aspect-video"
										>
											<img
												src={image}
												alt={`Property ${index + 1}`}
												className="w-full h-full object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() =>
													removeImage(index, false)
												}
												className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white/90"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}

									{/* New Image Previews */}
									{imagePreviews.map((preview, index) => (
										<div
											key={`preview-${index}`}
											className="relative aspect-video"
										>
											<img
												src={preview}
												alt={`New Property ${
													index + 1
												}`}
												className="w-full h-full object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() =>
													removeImage(index, true)
												}
												className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white/90"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}

									{/* Upload Button */}
									<label className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
										<input
											type="file"
											accept="image/*"
											multiple
											onChange={handleImageUpload}
											className="hidden"
										/>
										<Plus className="h-6 w-6 text-gray-400" />
									</label>
								</div>
							</div>
						</div>

						<div className="flex justify-end space-x-2">
							<Button
								type="submit"
								disabled={uploading}
								className="w-full sm:w-auto"
							>
								{uploading ? (
									<>
										<span className="loading loading-spinner loading-sm mr-2"></span>
										Saving...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" />
										Save Changes
									</>
								)}
							</Button>
						</div>
					</form>

					{formData.currentRental && (
						<div className="mt-6 space-y-4 border rounded-lg p-4">
							<h3 className="text-lg font-semibold">
								Current Rental
							</h3>
							<div className="space-y-2">
								<p>
									<span className="font-medium">Tenant:</span>{' '}
									{formData.currentRental.renter.name}
								</p>
								<p>
									<span className="font-medium">
										Start Date:
									</span>{' '}
									{new Date(
										formData.currentRental.startDate
									).toLocaleDateString()}
								</p>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">
											End Rental
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												End Rental
											</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to end
												this rental? This will mark the
												rental as completed and allow
												the tenant to leave a review.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleEndRental}
											>
												End Rental
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
