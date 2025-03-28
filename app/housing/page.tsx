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

// Mock housing data
const HOUSING_OPTIONS = [
	{
		id: 1,
		title: 'Modern Studio Apartment',
		description:
			'Bright and spacious studio apartment, perfect for students. Close to public transportation.',
		price: 750,
		currency: 'USD',
		period: 'month',
		location: 'Downtown University District',
		distance: '0.5 miles to campus',
		bedrooms: 0,
		bathrooms: 1,
		size: 350,
		sizeUnit: 'sq ft',
		amenities: ['Wifi', 'Furnished', 'Laundry', 'Kitchen'],
		type: 'Studio',
		available: 'Immediately',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-blue-500 to-cyan-500',
	},
	{
		id: 2,
		title: 'Shared 3-Bedroom Apartment',
		description:
			'Private room in a shared apartment with two other students. Common kitchen and living area.',
		price: 450,
		currency: 'USD',
		period: 'month',
		location: 'North Campus Area',
		distance: '0.8 miles to campus',
		bedrooms: 3,
		bathrooms: 2,
		size: 900,
		sizeUnit: 'sq ft',
		amenities: ['Wifi', 'Furnished', 'Laundry', 'Kitchen', 'TV'],
		type: 'Shared',
		available: 'Sep 1, 2023',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-green-500 to-teal-500',
	},
	{
		id: 3,
		title: 'Cozy 1-Bedroom Apartment',
		description:
			'Fully furnished 1-bedroom apartment with modern amenities. Utilities included.',
		price: 900,
		currency: 'USD',
		period: 'month',
		location: 'East Village',
		distance: '1.2 miles to campus',
		bedrooms: 1,
		bathrooms: 1,
		size: 500,
		sizeUnit: 'sq ft',
		amenities: ['Wifi', 'Furnished', 'Laundry', 'Kitchen', 'TV', 'Parking'],
		type: 'Private',
		available: 'Aug 15, 2023',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-purple-500 to-pink-500',
	},
	{
		id: 4,
		title: 'Student Residence Hall',
		description:
			'Single room in a student residence hall with shared facilities. Meal plan available.',
		price: 650,
		currency: 'USD',
		period: 'month',
		location: 'On Campus',
		distance: 'On campus',
		bedrooms: 1,
		bathrooms: 0.5,
		size: 200,
		sizeUnit: 'sq ft',
		amenities: ['Wifi', 'Furnished', 'Laundry', 'Meal Plan'],
		type: 'Dorm',
		available: 'Sep 1, 2023',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-orange-500 to-amber-500',
	},
	{
		id: 5,
		title: 'Luxury 2-Bedroom Apartment',
		description:
			'Modern 2-bedroom apartment with high-end finishes. Perfect for sharing with a roommate.',
		price: 1200,
		currency: 'USD',
		period: 'month',
		location: 'West End',
		distance: '1.5 miles to campus',
		bedrooms: 2,
		bathrooms: 2,
		size: 800,
		sizeUnit: 'sq ft',
		amenities: [
			'Wifi',
			'Furnished',
			'Laundry',
			'Kitchen',
			'TV',
			'Gym',
			'Pool',
		],
		type: 'Private',
		available: 'Aug 1, 2023',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-pink-500 to-rose-500',
	},
	{
		id: 6,
		title: 'Homestay with Local Family',
		description:
			'Private room in a family home. Breakfast and dinner included. Great for cultural immersion.',
		price: 800,
		currency: 'USD',
		period: 'month',
		location: 'Suburban Area',
		distance: '2.5 miles to campus',
		bedrooms: 1,
		bathrooms: 1,
		size: 250,
		sizeUnit: 'sq ft',
		amenities: ['Wifi', 'Furnished', 'Laundry', 'Meals Included'],
		type: 'Homestay',
		available: 'Immediately',
		image: '/placeholder.svg?height=200&width=300',
		color: 'from-yellow-500 to-amber-500',
	},
];

export default function HousingPage() {
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
								placeholder="Search by location, university..."
								className="pl-10 border-primary/20 focus-visible:ring-primary"
							/>
						</div>

						<div>
							<Select>
								<SelectTrigger className="border-primary/20 focus:ring-primary">
									<SelectValue placeholder="Housing Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Types
									</SelectItem>
									<SelectItem value="private">
										Private Apartment
									</SelectItem>
									<SelectItem value="shared">
										Shared Apartment
									</SelectItem>
									<SelectItem value="studio">
										Studio
									</SelectItem>
									<SelectItem value="dorm">
										Dormitory
									</SelectItem>
									<SelectItem value="homestay">
										Homestay
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Select>
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
									<SelectItem value="1000+">
										$1000+
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button className="gradient-bg hover:opacity-90 transition-opacity">
							<Search className="mr-2 h-4 w-4" /> Search
						</Button>
					</div>

					<div className="flex flex-wrap gap-2 mt-4">
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
							Near Campus
						</Badge>
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
							Furnished
						</Badge>
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
							Utilities Included
						</Badge>
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
							Wifi
						</Badge>
						<Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer">
							Available Now
						</Badge>
					</div>
				</div>

				<Tabs defaultValue="grid" className="mb-8">
					<div className="flex justify-between items-center">
						<p className="text-muted-foreground">
							Showing {HOUSING_OPTIONS.length} properties
						</p>
						<TabsList>
							<TabsTrigger value="grid">Grid</TabsTrigger>
							<TabsTrigger value="list">List</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="grid" className="mt-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{HOUSING_OPTIONS.map((housing) => (
								<Card
									key={housing.id}
									className="overflow-hidden border-0 shadow-lg card-hover bg-white"
								>
									<div
										className={`h-3 w-full bg-gradient-to-r ${housing.color}`}
									></div>
									<div className="relative">
										<img
											src={
												housing.image ||
												'/placeholder.svg'
											}
											alt={housing.title}
											className="w-full h-48 object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
										<Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
											${housing.price}/{housing.period}
										</Badge>
										<Badge className="absolute bottom-3 left-3 bg-white/90 text-secondary hover:bg-white/80">
											{housing.type}
										</Badge>
									</div>
									<CardHeader>
										<div className="flex justify-between items-start">
											<CardTitle className="text-xl">
												{housing.title}
											</CardTitle>
										</div>
										<CardDescription className="flex items-center gap-1">
											<MapPin className="h-4 w-4 text-muted-foreground" />
											{housing.location}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-gray-500 mb-4">
											{housing.description}
										</p>
										<div className="flex flex-wrap gap-4 text-sm text-gray-500">
											<div className="flex items-center gap-1">
												<Bed className="h-4 w-4 text-muted-foreground" />
												<span>
													{housing.bedrooms}{' '}
													{housing.bedrooms === 1
														? 'Bedroom'
														: 'Bedrooms'}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Bath className="h-4 w-4 text-muted-foreground" />
												<span>
													{housing.bathrooms}{' '}
													{housing.bathrooms === 1
														? 'Bathroom'
														: 'Bathrooms'}
												</span>
											</div>
											<div className="flex items-center gap-1">
												<Home className="h-4 w-4 text-muted-foreground" />
												<span>
													{housing.size}{' '}
													{housing.sizeUnit}
												</span>
											</div>
										</div>
										<div className="flex flex-wrap gap-2 mt-4">
											{housing.amenities
												.slice(0, 3)
												.map((amenity, index) => (
													<Badge
														key={index}
														variant="outline"
														className="bg-primary/5 border-primary/10 text-primary hover:bg-primary/10"
													>
														{amenity}
													</Badge>
												))}
											{housing.amenities.length > 3 && (
												<Badge
													variant="outline"
													className="bg-primary/5 border-primary/10 hover:bg-primary/10"
												>
													+
													{housing.amenities.length -
														3}{' '}
													more
												</Badge>
											)}
										</div>
									</CardContent>
									<CardFooter className="flex flex-col gap-2">
										<div className="flex items-center gap-1 text-sm text-muted-foreground mb-2 w-full">
											<Calendar className="h-4 w-4" />
											<span>
												Available: {housing.available}
											</span>
										</div>
										<Link
											href={`/housing/${housing.id}`}
											className="w-full"
										>
											<Button className="w-full gradient-bg hover:opacity-90 transition-opacity">
												View Details
											</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="list" className="mt-6">
						<div className="space-y-4">
							{HOUSING_OPTIONS.map((housing) => (
								<Card
									key={housing.id}
									className="overflow-hidden border-0 shadow-lg card-hover bg-white"
								>
									<div className="flex flex-col md:flex-row">
										<div className="relative md:w-1/3">
											<div
												className={`h-3 w-full bg-gradient-to-r ${housing.color}`}
											></div>
											<img
												src={
													housing.image ||
													'/placeholder.svg'
												}
												alt={housing.title}
												className="w-full h-48 md:h-full object-cover"
											/>
											<Badge className="absolute bottom-3 right-3 bg-white/90 text-primary hover:bg-white/80">
												${housing.price}/
												{housing.period}
											</Badge>
											<Badge className="absolute top-6 left-3 bg-white/90 text-secondary hover:bg-white/80">
												{housing.type}
											</Badge>
										</div>
										<div className="md:w-2/3 p-6">
											<div className="mb-4">
												<h3 className="text-xl font-bold mb-1">
													{housing.title}
												</h3>
												<div className="flex items-center text-muted-foreground mb-2">
													<MapPin className="h-4 w-4 mr-1" />
													{housing.location} •{' '}
													<span className="ml-1">
														{housing.distance}
													</span>
												</div>
												<p className="text-sm text-gray-500">
													{housing.description}
												</p>
											</div>

											<div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
												<div className="flex items-center gap-1">
													<Bed className="h-4 w-4 text-muted-foreground" />
													<span>
														{housing.bedrooms}{' '}
														{housing.bedrooms === 1
															? 'Bedroom'
															: 'Bedrooms'}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Bath className="h-4 w-4 text-muted-foreground" />
													<span>
														{housing.bathrooms}{' '}
														{housing.bathrooms === 1
															? 'Bathroom'
															: 'Bathrooms'}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Home className="h-4 w-4 text-muted-foreground" />
													<span>
														{housing.size}{' '}
														{housing.sizeUnit}
													</span>
												</div>
											</div>

											<div className="flex flex-wrap gap-2 mb-4">
												{housing.amenities.map(
													(amenity, index) => (
														<Badge
															key={index}
															variant="outline"
															className="bg-primary/5 border-primary/10 text-primary hover:bg-primary/10"
														>
															{amenity}
														</Badge>
													)
												)}
											</div>

											<div className="p-4 md:pl-0 flex justify-between items-center mt-4">
												<Badge className="bg-white text-primary border border-primary/20">
													${housing.price}/
													{housing.period}
												</Badge>
												<Link
													href={`/housing/${housing.id}`}
												>
													<Button className="gradient-bg hover:opacity-90 transition-opacity">
														View Details
													</Button>
												</Link>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
