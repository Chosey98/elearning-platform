'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
	const pathname = usePathname();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		// Check if user is logged in
		const user = localStorage.getItem('user');
		setIsLoggedIn(!!user);
	}, [pathname]);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg">
							<GraduationCap className="h-4 w-4 text-white" />
						</div>
						<span className="font-bold text-xl hidden md:inline-block gradient-text">
							EduNest
						</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6">
					<Link
						href="/"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							pathname === '/'
								? 'text-primary'
								: 'text-muted-foreground'
						}`}
					>
						Home
					</Link>
					<Link
						href="/courses"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							pathname === '/courses' ||
							pathname.startsWith('/courses/')
								? 'text-primary'
								: 'text-muted-foreground'
						}`}
					>
						Courses
					</Link>
					<Link
						href="/housing"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							pathname === '/housing' ||
							pathname.startsWith('/housing/')
								? 'text-primary'
								: 'text-muted-foreground'
						}`}
					>
						Housing
					</Link>

					{isLoggedIn ? (
						<>
							<Link
								href="/dashboard"
								className={`text-sm font-medium transition-colors hover:text-primary ${
									pathname === '/dashboard'
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								Dashboard
							</Link>
							<Button
								variant="outline"
								size="sm"
								className="border-primary/20 hover:bg-primary/5"
								onClick={() => {
									localStorage.removeItem('user');
									window.location.href = '/';
								}}
							>
								Logout
							</Button>
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login">
								<Button
									variant="ghost"
									size="sm"
									className="hover:text-primary hover:bg-primary/5"
								>
									Sign In
								</Button>
							</Link>
							<Link href="/register">
								<Button
									size="sm"
									className="gradient-bg hover:opacity-90 transition-opacity"
								>
									<Sparkles className="mr-2 h-4 w-4" /> Sign
									Up
								</Button>
							</Link>
						</div>
					)}
				</nav>

				{/* Mobile Navigation */}
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
						>
							<Menu className="h-6 w-6" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="border-l-primary/20 bg-white"
					>
						<div className="flex flex-col gap-6 pt-6">
							<Link
								href="/"
								className={`text-lg font-medium transition-colors hover:text-primary ${
									pathname === '/'
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								Home
							</Link>
							<Link
								href="/courses"
								className={`text-lg font-medium transition-colors hover:text-primary ${
									pathname === '/courses' ||
									pathname.startsWith('/courses/')
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								Courses
							</Link>
							<Link
								href="/housing"
								className={`text-lg font-medium transition-colors hover:text-primary ${
									pathname === '/housing' ||
									pathname.startsWith('/housing/')
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								Housing
							</Link>

							{isLoggedIn ? (
								<>
									<Link
										href="/dashboard"
										className={`text-lg font-medium transition-colors hover:text-primary ${
											pathname === '/dashboard'
												? 'text-primary'
												: 'text-muted-foreground'
										}`}
									>
										Dashboard
									</Link>
									<Button
										variant="outline"
										className="border-primary/20 hover:bg-primary/5"
										onClick={() => {
											localStorage.removeItem('user');
											window.location.href = '/';
										}}
									>
										Logout
									</Button>
								</>
							) : (
								<div className="flex flex-col gap-2">
									<Link href="/login">
										<Button
											variant="outline"
											className="w-full border-primary/20 hover:bg-primary/5"
										>
											Sign In
										</Button>
									</Link>
									<Link href="/register">
										<Button className="w-full gradient-bg hover:opacity-90 transition-opacity">
											<Sparkles className="mr-2 h-4 w-4" />{' '}
											Sign Up
										</Button>
									</Link>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
