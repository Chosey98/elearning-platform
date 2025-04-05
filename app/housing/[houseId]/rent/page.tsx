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
import { useToast } from '@/components/ui/use-toast';
import { Home, Calendar } from 'lucide-react';
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
import { Label } from '@/components/ui/label';

interface House {
	id: string;
	title: string;
	description: string;
	address: string;
	price: number;
	images: string[];
	status: string;
	currentRental?: {
		renter: {
			name: string;
			email: string;
		};
	};
}

export default function RentHousePage({
	params,
}: {
	params: { houseId: string };
}) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [renting, setRenting] = useState(false);
	const [house, setHouse] = useState<House | null>(null);
	const [formData, setFormData] = useState({
		startDate: '',
		endDate: '',
	});
	const [totalAmount, setTotalAmount] = useState<number | null>(null);

	useEffect(() => {
		const fetchHouse = async () => {
			try {
				const response = await fetch(`/api/housing/${params.houseId}`);
				if (response.ok) {
					const data = await response.json();
					setHouse(data);
				}
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

		if (session?.user) {
			fetchHouse();
		}
	}, [params.houseId, session, toast]);

	useEffect(() => {
		if (formData.startDate && formData.endDate && house) {
			try {
				const start = new Date(formData.startDate);
				const end = new Date(formData.endDate);

				if (start >= end || start < new Date()) {
					setTotalAmount(null);
					return;
				}

				const daysDiff = Math.ceil(
					(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
				);
				const monthsFloat = daysDiff / 30; // Using 30 days as average month length
				setTotalAmount(Math.ceil(house.price * monthsFloat));
			} catch (error) {
				setTotalAmount(null);
			}
		} else {
			setTotalAmount(null);
		}
	}, [formData.startDate, formData.endDate, house]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setRenting(true);

		try {
			// Validate dates
			const start = new Date(formData.startDate);
			const end = new Date(formData.endDate);

			if (start >= end) {
				throw new Error('End date must be after start date');
			}

			if (start < new Date()) {
				throw new Error('Start date must be in the future');
			}

			// Calculate total days and convert to months for payment
			const daysDiff = Math.ceil(
				(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
			);
			const monthsFloat = daysDiff / 30; // Using 30 days as average month length
			const totalAmount = Math.ceil(house!.price * monthsFloat);

			// Redirect to payment page
			router.push(
				`/payment?type=housing&id=${
					house?.id
				}&title=${encodeURIComponent(
					house?.title || ''
				)}&amount=${totalAmount}&returnUrl=${encodeURIComponent(
					`/housing/${house?.id}?success=true&houseId=${house?.id}&startDate=${formData.startDate}&endDate=${formData.endDate}`
				)}`
			);
		} catch (error) {
			console.error('Error renting house:', error);
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to process rental request',
				variant: 'destructive',
			});
		} finally {
			setRenting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (status === 'loading' || loading) {
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

	if (!house) {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>House Not Found</CardTitle>
						<CardDescription>
							The house you're looking for doesn't exist or you
							don't have permission to view it.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/housing')}>
							Back to Housing
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (house.status !== 'available') {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>House Not Available</CardTitle>
						<CardDescription>
							This house is currently rented out.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push('/housing')}>
							Back to Housing
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Home className="h-5 w-5 text-primary" />
						<CardTitle>Rent Property</CardTitle>
					</div>
					<CardDescription>
						Complete the form below to rent this property
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-semibold">
									{house.title}
								</h3>
								<p className="text-sm text-muted-foreground">
									{house.address}
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="grid gap-2">
									<Label htmlFor="startDate">
										Start Date
									</Label>
									<Input
										id="startDate"
										name="startDate"
										type="date"
										value={formData.startDate}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="endDate">End Date</Label>
									<Input
										id="endDate"
										name="endDate"
										type="date"
										value={formData.endDate}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="bg-muted p-4 rounded-lg">
								<div className="flex justify-between items-center">
									<span>Monthly Rent</span>
									<span className="font-semibold">
										${house.price}
									</span>
								</div>
								{totalAmount !== null && (
									<div className="flex justify-between items-center mt-2 pt-2 border-t">
										<span>Total Amount</span>
										<span className="font-semibold">
											${totalAmount}
										</span>
									</div>
								)}
								<div className="text-sm text-muted-foreground mt-2">
									* Final amount will be calculated based on
									the rental period
								</div>
							</div>
						</div>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									className="w-full gradient-bg hover:opacity-90"
									disabled={renting}
								>
									{renting
										? 'Processing...'
										: 'Proceed to Payment'}
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Confirm Rental Details
									</AlertDialogTitle>
									<AlertDialogDescription>
										Please review the rental details before
										proceeding to payment. By continuing,
										you agree to the rental terms and
										conditions.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => {
											const form =
												document.querySelector('form');
											if (form) form.requestSubmit();
										}}
									>
										Continue to Payment
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
