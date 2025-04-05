'use client';

import { useState } from 'react';
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
import { Home, Upload, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AddressPicker from '@/components/AddressPicker';
import Map from '@/components/Map';

const AMENITIES = [
	'WiFi',
	'Air Conditioning',
	'Heating',
	'Washer',
	'Dryer',
	'Kitchen',
	'Parking',
	'TV',
	'Gym',
	'Pool',
	'Security System',
	'Elevator',
	'Furnished',
	'Balcony',
	'Pet Friendly',
	'Storage',
	'Dishwasher',
	'Microwave',
] as const;

export default function AddHousePage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [images, setImages] = useState<File[]>([]);
	const [coordinates, setCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		address: '',
		price: '',
		type: '',
		bedrooms: '1',
		bathrooms: '1',
		size: '',
		location: '',
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newImages = Array.from(e.target.files);
			setImages((prev) => [...prev, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const toggleAmenity = (amenity: string) => {
		setSelectedAmenities((prev) =>
			prev.includes(amenity)
				? prev.filter((a) => a !== amenity)
				: [...prev, amenity]
		);
	};

	const handleAddressChange = (
		address: string,
		lat?: number,
		lng?: number
	) => {
		setFormData((prev) => ({
			...prev,
			address,
		}));
		if (lat && lng) {
			setCoordinates({ lat, lng });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// First, upload images
			const imageUrls = await Promise.all(
				images.map(async (image) => {
					const formData = new FormData();
					formData.append('file', image);

					const response = await fetch('/api/housing/upload', {
						method: 'POST',
						body: formData,
					});

					if (!response.ok) {
						const error = await response.json();
						throw new Error(
							error.error || 'Failed to upload image'
						);
					}
					const data = await response.json();
					return data.url;
				})
			);

			console.log('Uploaded image URLs:', imageUrls); // Debug log

			// Then create the house with image URLs and coordinates
			const response = await fetch('/api/housing', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...formData,
					amenities: selectedAmenities,
					images: imageUrls,
					latitude: coordinates?.lat,
					longitude: coordinates?.lng,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.details || 'Failed to create house');
			}

			toast({
				title: 'Success',
				description: 'House added successfully',
			});

			router.push('/dashboard/homeowner');
		} catch (error) {
			console.error('Error creating house:', error);
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to add house',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		router.push('/login');
		return null;
	}

	return (
		<div className="container py-10">
			<Card>
				<CardHeader>
					<CardTitle>Add New Property</CardTitle>
					<CardDescription>
						Fill in the details to list your property
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="title">Property Title</Label>
								<Input
									id="title"
									name="title"
									value={formData.title}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="address">
									Property Address
								</Label>
								<AddressPicker
									value={formData.address}
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
								<Label htmlFor="location">Location/Area</Label>
								<Input
									id="location"
									name="location"
									value={formData.location}
									onChange={handleChange}
									required
									placeholder="e.g., Downtown, University District"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="price">
										Monthly Price ($)
									</Label>
									<Input
										id="price"
										name="price"
										type="number"
										value={formData.price}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="type">Property Type</Label>
									<Select
										name="type"
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

							<div className="grid grid-cols-3 gap-4">
								<div className="grid gap-2">
									<Label htmlFor="bedrooms">Bedrooms</Label>
									<Select
										name="bedrooms"
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												bedrooms: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{[1, 2, 3, 4, 5].map((num) => (
												<SelectItem
													key={num}
													value={num.toString()}
												>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<Select
										name="bathrooms"
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												bathrooms: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{[1, 2, 3, 4].map((num) => (
												<SelectItem
													key={num}
													value={num.toString()}
												>
													{num}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="size">Size (sq ft)</Label>
									<Input
										id="size"
										name="size"
										type="number"
										value={formData.size}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

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

							<div className="grid gap-2">
								<Label>Images</Label>
								<div className="flex flex-wrap gap-4">
									{images.map((image, index) => (
										<div key={index} className="relative">
											<img
												src={URL.createObjectURL(image)}
												alt={`Preview ${index + 1}`}
												className="w-24 h-24 object-cover rounded-lg"
											/>
											<button
												type="button"
												onClick={() =>
													removeImage(index)
												}
												className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
									<label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary">
										<Upload className="h-6 w-6 text-gray-400" />
										<span className="text-xs text-gray-500 mt-1">
											Upload
										</span>
										<input
											type="file"
											accept="image/*"
											multiple
											onChange={handleImageChange}
											className="hidden"
										/>
									</label>
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full gradient-bg hover:opacity-90"
							disabled={loading}
						>
							{loading ? (
								<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
							) : (
								<>
									<Home className="mr-2 h-4 w-4" /> Add
									Property
								</>
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
