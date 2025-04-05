'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Rating {
	id: string;
	rating: number;
	comment?: string;
	user: {
		name: string;
	};
	createdAt: string;
}

interface RatingProps {
	type: 'course' | 'house';
	itemId: string;
	canRate?: boolean;
	className?: string;
}

export function Rating({
	type,
	itemId,
	canRate = false,
	className = '',
}: RatingProps) {
	const [ratings, setRatings] = useState<Rating[]>([]);
	const [averageRating, setAverageRating] = useState(0);
	const [totalRatings, setTotalRatings] = useState(0);
	const [userRating, setUserRating] = useState(0);
	const [comment, setComment] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		fetchRatings();
	}, [itemId, type]);

	const fetchRatings = async () => {
		try {
			const endpoint =
				type === 'house'
					? `/api/housing/${itemId}/rating`
					: `/api/courses/${itemId}/rating`;
			const response = await fetch(endpoint);
			if (response.ok) {
				const data = await response.json();
				setRatings(data.ratings);
				setAverageRating(data.averageRating);
				setTotalRatings(data.totalRatings);
			}
		} catch (error) {
			console.error('Error fetching ratings:', error);
		}
	};

	const handleSubmitRating = async () => {
		if (userRating === 0) {
			toast({
				title: 'Rating required',
				description: 'Please select a rating before submitting',
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);
		try {
			const endpoint =
				type === 'house'
					? `/api/housing/${itemId}/rating`
					: `/api/courses/${itemId}/rating`;
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					rating: userRating,
					comment,
				}),
			});

			if (response.ok) {
				toast({
					title: 'Rating submitted',
					description: 'Thank you for your feedback!',
				});
				setIsOpen(false);
				fetchRatings();
				setUserRating(0);
				setComment('');
			} else {
				const data = await response.json();
				toast({
					title: 'Error',
					description: data.error || 'Failed to submit rating',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Error submitting rating:', error);
			toast({
				title: 'Error',
				description: 'Failed to submit rating',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={className}>
			<Tabs defaultValue="overview" className="w-full">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="reviews">
						Reviews ({totalRatings})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={`h-5 w-5 ${
										star <= averageRating
											? 'text-yellow-400 fill-current'
											: 'text-gray-300'
									}`}
								/>
							))}
						</div>
						<span className="text-sm text-muted-foreground">
							({totalRatings}{' '}
							{totalRatings === 1 ? 'review' : 'reviews'})
						</span>
						{canRate && (
							<Dialog open={isOpen} onOpenChange={setIsOpen}>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										Add Review
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>
											Add Your Review
										</DialogTitle>
										<DialogDescription>
											Share your experience with others.
											Your review will help them make
											informed decisions.
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="flex items-center justify-center gap-2">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`h-8 w-8 cursor-pointer transition-colors ${
														star <= userRating
															? 'text-yellow-400 fill-current'
															: 'text-gray-300 hover:text-yellow-400'
													}`}
													onClick={() =>
														setUserRating(star)
													}
												/>
											))}
										</div>
										<Textarea
											placeholder="Write your review here..."
											value={comment}
											onChange={(
												e: React.ChangeEvent<HTMLTextAreaElement>
											) => setComment(e.target.value)}
										/>
									</div>
									<DialogFooter>
										<Button
											onClick={handleSubmitRating}
											disabled={isLoading}
										>
											{isLoading
												? 'Submitting...'
												: 'Submit Review'}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						)}
					</div>
				</TabsContent>

				<TabsContent value="reviews">
					<div className="space-y-4">
						{ratings.length > 0 ? (
							ratings.map((rating) => (
								<div
									key={rating.id}
									className="border rounded-lg p-4 space-y-2"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="flex">
												{[1, 2, 3, 4, 5].map((star) => (
													<Star
														key={star}
														className={`h-4 w-4 ${
															star <=
															rating.rating
																? 'text-yellow-400 fill-current'
																: 'text-gray-300'
														}`}
													/>
												))}
											</div>
											<span className="font-medium">
												{rating.user.name}
											</span>
										</div>
										<span className="text-sm text-muted-foreground">
											{new Date(
												rating.createdAt
											).toLocaleDateString()}
										</span>
									</div>
									{rating.comment && (
										<p className="text-sm text-muted-foreground">
											{rating.comment}
										</p>
									)}
								</div>
							))
						) : (
							<div className="text-center py-8 text-muted-foreground">
								No reviews yet. Be the first to review!
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
