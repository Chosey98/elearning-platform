import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	GraduationCap,
	Sparkles,
	Zap,
	Globe,
	Home as HomeIcon,
} from 'lucide-react';

export default function Home() {
	return (
		<div className="flex flex-col min-h-[calc(100vh-4rem)]">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 gradient-bg text-white relative overflow-hidden">
					<div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] opacity-10 bg-cover bg-center"></div>
					<div className="container px-4 md:px-6 relative z-10">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="inline-block p-2 bg-white/10 rounded-xl backdrop-blur-sm mb-4">
								<Globe className="h-6 w-6 text-yellow-300" />
							</div>
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
									Learn & Live Abroad with Confidence
								</h1>
								<p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
									The complete platform for international
									students. Find courses and comfortable
									housing in one place.
								</p>
							</div>
							<div className="space-x-4 mt-6">
								<Link href="/register">
									<Button
										size="lg"
										className="bg-white text-primary hover:bg-white/90"
									>
										Get Started
									</Button>
								</Link>
								<Link href="/login">
									<Button
										variant="outline"
										size="lg"
										className="border-white text-black hover:bg-white/10"
									>
										Sign In
									</Button>
								</Link>
							</div>
						</div>
					</div>

					{/* Decorative elements */}
					<div className="absolute -bottom-16 -left-16 w-64 h-64 bg-secondary/30 rounded-full blur-3xl"></div>
					<div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/30 rounded-full blur-3xl"></div>
				</section>

				{/* Services Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
							<div className="space-y-2">
								<div className="inline-flex items-center justify-center p-2 bg-purple-100 rounded-lg mb-4">
									<Zap className="h-6 w-6 text-primary" />
								</div>
								<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">
									Our Services
								</h2>
								<p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Everything international students need to
									succeed abroad.
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
							{/* Education Card */}
							<div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
								<div className="h-3 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
								<div className="p-6">
									<div className="flex items-center gap-4 mb-4">
										<div className="flex h-16 w-16 items-center justify-center rounded-full feature-icon-bg">
											<GraduationCap className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-2xl font-bold">
											Education
										</h3>
									</div>
									<p className="text-gray-500 mb-6">
										Access hundreds of courses from top
										institutions. Learn at your own pace
										with personalized learning paths.
									</p>
									<ul className="space-y-2 mb-6">
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Expert-led courses in multiple
												languages
											</span>
										</li>
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Interactive learning experiences
											</span>
										</li>
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Certificates recognized
												worldwide
											</span>
										</li>
									</ul>
									<Link href="/courses">
										<Button className="w-full">
											Explore Courses
										</Button>
									</Link>
								</div>
							</div>

							{/* Housing Card */}
							<div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
								<div className="h-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
								<div className="p-6">
									<div className="flex items-center gap-4 mb-4">
										<div className="flex h-16 w-16 items-center justify-center rounded-full feature-icon-bg">
											<HomeIcon className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-2xl font-bold">
											Housing
										</h3>
									</div>
									<p className="text-gray-500 mb-6">
										Find safe, comfortable, and affordable
										housing options near your educational
										institution.
									</p>
									<ul className="space-y-2 mb-6">
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Verified landlords and
												properties
											</span>
										</li>
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Virtual tours and detailed
												descriptions
											</span>
										</li>
										<li className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-secondary" />
											<span>
												Support for lease agreements in
												multiple languages
											</span>
										</li>
									</ul>
									<Link href="/housing">
										<Button className="w-full">
											Find Housing
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-white">
					<div className="container px-4 md:px-6">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold gradient-text mb-4">
								How It Works
							</h2>
							<p className="text-gray-500 max-w-2xl mx-auto">
								Our platform makes it easy for international
								students to find everything they need in one
								place.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
							<div className="text-center">
								<div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
									<span className="text-white text-2xl font-bold">
										1
									</span>
								</div>
								<h3 className="text-xl font-bold mb-2">
									Create an Account
								</h3>
								<p className="text-gray-500">
									Sign up and complete your profile with your
									educational preferences and housing needs.
								</p>
							</div>

							<div className="text-center">
								<div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
									<span className="text-white text-2xl font-bold">
										2
									</span>
								</div>
								<h3 className="text-xl font-bold mb-2">
									Browse Options
								</h3>
								<p className="text-gray-500">
									Explore courses and housing options that
									match your requirements and budget.
								</p>
							</div>

							<div className="text-center">
								<div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
									<span className="text-white text-2xl font-bold">
										3
									</span>
								</div>
								<h3 className="text-xl font-bold mb-2">
									Book & Learn
								</h3>
								<p className="text-gray-500">
									Enroll in courses and secure your housing
									with our streamlined application process.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="w-full py-12 md:py-24 lg:py-32 light-gradient-1">
					<div className="container px-4 md:px-6">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold gradient-text mb-4">
								Student Success Stories
							</h2>
							<p className="text-gray-500 max-w-2xl mx-auto">
								Hear from international students who found their
								perfect educational and living experience
								through our platform.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
							<div className="bg-white p-6 rounded-xl shadow-sm card-hover">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
									<div>
										<h4 className="font-bold">Maria S.</h4>
										<p className="text-sm text-gray-500">
											Spain to Canada
										</p>
									</div>
								</div>
								<p className="text-gray-600">
									"Finding both a great data science program
									and affordable housing near campus was so
									easy with this platform. The virtual tours
									helped me choose the perfect apartment
									before I even arrived in Canada."
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm card-hover">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
									<div>
										<h4 className="font-bold">Ahmed K.</h4>
										<p className="text-sm text-gray-500">
											Egypt to Germany
										</p>
									</div>
								</div>
								<p className="text-gray-600">
									"As a foreign student, navigating housing
									contracts was intimidating. The multilingual
									support and verified listings gave me peace
									of mind when securing my apartment near the
									university."
								</p>
							</div>

							<div className="bg-white p-6 rounded-xl shadow-sm card-hover">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
									<div>
										<h4 className="font-bold">Lin W.</h4>
										<p className="text-sm text-gray-500">
											China to Australia
										</p>
									</div>
								</div>
								<p className="text-gray-600">
									"I completed three certification courses
									while still in China, and had my housing
									arranged before my flight. The transition to
									studying abroad was smoother than I ever
									expected."
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-white">
					<div className="container px-4 md:px-6">
						<div className="max-w-3xl mx-auto text-center">
							<h2 className="text-3xl font-bold gradient-text mb-4">
								Ready to Start Your International Journey?
							</h2>
							<p className="text-gray-500 mb-8">
								Join thousands of students who have found their
								perfect educational and living experience
								abroad.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Link href="/register">
									<Button
										size="lg"
										className="gradient-bg hover:opacity-90 transition-opacity w-full sm:w-auto"
									>
										<Sparkles className="mr-2 h-5 w-5" />{' '}
										Create Account
									</Button>
								</Link>
								<Link href="/housing">
									<Button
										size="lg"
										variant="outline"
										className="border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
									>
										<HomeIcon className="mr-2 h-5 w-5" />{' '}
										Browse Housing
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
