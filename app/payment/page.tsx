'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, CreditCard, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';

export default function PaymentPage() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const [isProcessing, setIsProcessing] = useState(false);
	const [cardDetails, setCardDetails] = useState({
		cardNumber: '',
		expiry: '',
		cvc: '',
		name: '',
	});
	const [cardType, setCardType] = useState<
		'visa' | 'mastercard' | 'amex' | 'discover' | 'other' | null
	>(null);

	// Get parameters from URL
	const type = searchParams.get('type') || 'course'; // 'course' or 'housing'
	const itemId = searchParams.get('id') || '';
	const title = searchParams.get('title') || 'Item';
	const amount = searchParams.get('amount') || '0';
	const returnUrl = searchParams.get('returnUrl');

	// Detect card type based on card number
	useEffect(() => {
		const cardNum = cardDetails.cardNumber.replace(/\s/g, '');

		if (cardNum.length > 0) {
			// Visa starts with 4
			if (cardNum.startsWith('4')) {
				setCardType('visa');
			}
			// Mastercard starts with 51-55
			else if (/^5[1-5]/.test(cardNum)) {
				setCardType('mastercard');
			}
			// American Express starts with 34 or 37
			else if (/^3[47]/.test(cardNum)) {
				setCardType('amex');
			}
			// Discover starts with 6011, 622126-622925, 644-649, 65
			else if (
				/^(6011|65|64[4-9]|622(12[6-9]|1[3-9]\d|[2-8]\d\d|9[01]\d|92[0-5]))/.test(
					cardNum
				)
			) {
				setCardType('discover');
			} else {
				setCardType('other');
			}
		} else {
			setCardType(null);
		}
	}, [cardDetails.cardNumber]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// Format card number with spaces after every 4 digits
		if (name === 'cardNumber') {
			const formattedValue = value
				.replace(/\s/g, '')
				.replace(/(\d{4})/g, '$1 ')
				.trim()
				.slice(0, 19); // Limit to 16 digits + 3 spaces

			setCardDetails({ ...cardDetails, [name]: formattedValue });
		}
		// Format expiry date to MM/YY
		else if (name === 'expiry') {
			const formattedValue = value
				.replace(/\D/g, '')
				.replace(/^(\d{2})(\d{0,2})/, '$1/$2')
				.slice(0, 5);

			setCardDetails({ ...cardDetails, [name]: formattedValue });
		}
		// Limit CVC to 3-4 digits
		else if (name === 'cvc') {
			const formattedValue = value.replace(/\D/g, '').slice(0, 4);
			setCardDetails({ ...cardDetails, [name]: formattedValue });
		} else {
			setCardDetails({ ...cardDetails, [name]: value });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		try {
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: 'Payment successful!',
				description: `Your ${type} has been confirmed.`,
			});

			// Use router.replace() instead of push() to ensure a full page reload
			if (returnUrl) {
				window.location.href = returnUrl; // Use window.location for a full page reload
			} else {
				router.replace('/dashboard');
			}
		} catch (error) {
			console.error('Payment error:', error);
			toast({
				title: 'Payment failed',
				description: 'There was an error processing your payment.',
				variant: 'destructive',
			});
			setIsProcessing(false);
		}
	};

	// Get card logo and colors based on card type
	const getCardLogo = () => {
		switch (cardType) {
			case 'visa':
				return (
					<div className="px-2 py-1 rounded bg-blue-50 border border-blue-100">
						<span className="font-bold text-blue-600 text-xs">
							VISA
						</span>
					</div>
				);
			case 'mastercard':
				return (
					<div className="px-2 py-1 rounded bg-red-50 border border-red-100">
						<span className="font-bold text-red-600 text-xs">
							MASTERCARD
						</span>
					</div>
				);
			case 'amex':
				return (
					<div className="px-2 py-1 rounded bg-green-50 border border-green-100">
						<span className="font-bold text-green-600 text-xs">
							AMEX
						</span>
					</div>
				);
			case 'discover':
				return (
					<div className="px-2 py-1 rounded bg-orange-50 border border-orange-100">
						<span className="font-bold text-orange-600 text-xs">
							DISCOVER
						</span>
					</div>
				);
			case 'other':
				return <CreditCard className="h-5 w-5 text-gray-400" />;
			default:
				return null;
		}
	};

	if (status === 'loading') {
		return (
			<div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		router.push('/login');
		return null;
	}

	return (
		<div className="container max-w-4xl py-10">
			<Button
				variant="ghost"
				onClick={() => router.back()}
				className="mb-6"
			>
				<ArrowLeft className="mr-2 h-4 w-4" />
				Back
			</Button>

			<div className="grid gap-8 md:grid-cols-3">
				<div className="md:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Payment Details</CardTitle>
							<CardDescription>
								Complete your payment securely
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">
										Cardholder Name
									</Label>
									<Input
										id="name"
										name="name"
										placeholder="John Doe"
										required
										value={cardDetails.name}
										onChange={handleInputChange}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="cardNumber">
										Card Number
									</Label>
									<div className="relative">
										<Input
											id="cardNumber"
											name="cardNumber"
											placeholder="1234 5678 9012 3456"
											required
											value={cardDetails.cardNumber}
											onChange={handleInputChange}
											className="pr-10"
										/>
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											{getCardLogo()}
										</div>
									</div>
									{cardType && (
										<p className="text-xs text-muted-foreground mt-1">
											{cardType === 'visa'
												? 'Visa'
												: cardType === 'mastercard'
												? 'Mastercard'
												: cardType === 'amex'
												? 'American Express'
												: cardType === 'discover'
												? 'Discover'
												: 'Card'}{' '}
											detected
										</p>
									)}
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="expiry">
											Expiry Date
										</Label>
										<Input
											id="expiry"
											name="expiry"
											placeholder="MM/YY"
											required
											value={cardDetails.expiry}
											onChange={handleInputChange}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="cvc">CVC</Label>
										<Input
											id="cvc"
											name="cvc"
											placeholder="123"
											required
											value={cardDetails.cvc}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full mt-6 gradient-bg"
									disabled={isProcessing}
								>
									{isProcessing ? (
										<>
											<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></div>
											Processing...
										</>
									) : (
										<>
											<CreditCard className="mr-2 h-4 w-4" />
											Pay ${amount}
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				<div>
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="font-medium">{title}</p>
								<p className="text-sm text-muted-foreground">
									{type === 'course'
										? 'Course Enrollment'
										: 'Housing Booking'}
								</p>
							</div>

							<Separator />

							<div className="flex justify-between">
								<span>Price</span>
								<span>${amount}</span>
							</div>

							<div className="flex justify-between font-medium">
								<span>Total</span>
								<span>${amount}</span>
							</div>
						</CardContent>
						<CardFooter className="bg-muted/50 rounded-b-lg">
							<div className="w-full">
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Check className="mr-2 h-4 w-4 text-green-500" />
									Secure payment
								</div>
								<div className="flex items-center text-sm text-muted-foreground">
									<Check className="mr-2 h-4 w-4 text-green-500" />
									Instant confirmation
								</div>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}
