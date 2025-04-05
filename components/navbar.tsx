'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
	Menu,
	User,
	LogOut,
	ChevronDown,
	BookOpen,
	Building,
} from 'lucide-react';

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push('/');
	};

	// Close mobile menu when route changes
	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	// Use role directly from session
	const userRole = session?.user?.role || 'student';

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-2">
					<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
						<SheetContent side="left" className="sm:max-w-xs z-50">
							<SheetHeader>
								<SheetTitle className="text-left gradient-text">
									EduNest
								</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col gap-4 mt-6">
								<Link
									href="/"
									className="text-lg font-medium transition-colors hover:text-primary"
								>
									Home
								</Link>
								<Link
									href="/courses"
									className="text-lg font-medium transition-colors hover:text-primary"
								>
									Courses
								</Link>
								<Link
									href="/housing"
									className="text-lg font-medium transition-colors hover:text-primary"
								>
									Housing
								</Link>
								{status === 'authenticated' && (
									<>
										{userRole === 'student' && (
											<Link
												href="/dashboard"
												className="text-lg font-medium transition-colors hover:text-primary"
											>
												Dashboard
											</Link>
										)}

										{userRole === 'instructor' && (
											<>
												<Link
													href="/dashboard/instructor"
													className="text-lg font-medium transition-colors hover:text-primary"
												>
													Instructor Dashboard
												</Link>
												<Link
													href="/dashboard/instructor?tab=create"
													className="text-lg font-medium transition-colors hover:text-primary"
												>
													Create Course
												</Link>
											</>
										)}

										{userRole === 'homeowner' && (
											<Link
												href="/dashboard/homeowner"
												className="text-lg font-medium transition-colors hover:text-primary"
											>
												Property Dashboard
											</Link>
										)}
									</>
								)}
							</nav>
							<div className="mt-8">
								{status === 'authenticated' ? (
									<div className="flex flex-col gap-4">
										<div className="flex items-center gap-2 px-2">
											<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
												<User className="h-4 w-4 text-primary" />
											</div>
											<div>
												<p className="text-sm font-medium">
													{session.user?.name}
												</p>
												<p className="text-xs text-muted-foreground capitalize">
													{userRole}
												</p>
											</div>
										</div>
										<Button
											variant="outline"
											onClick={handleLogout}
											className="w-full"
										>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</Button>
									</div>
								) : (
									<div className="flex flex-col gap-2">
										<Link href="/login">
											<Button
												variant="outline"
												className="w-full"
											>
												Login
											</Button>
										</Link>
										<Link href="/register">
											<Button className="w-full gradient-bg hover:opacity-90">
												Sign Up
											</Button>
										</Link>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
					<Link href="/" className="flex items-center gap-2">
						<span className="gradient-text font-bold text-xl hidden sm:inline-block">
							Edunest
						</span>
						<span className="gradient-text font-bold text-xl sm:hidden">
							ELP
						</span>
					</Link>
				</div>

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
							pathname?.startsWith('/courses/')
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
							pathname?.startsWith('/housing/')
								? 'text-primary'
								: 'text-muted-foreground'
						}`}
					>
						Housing
					</Link>

					{/* Role-specific navigation */}
					{status === 'authenticated' && (
						<>
							{userRole === 'instructor' && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex items-center gap-1 px-2"
										>
											<BookOpen className="h-4 w-4 mr-1" />
											Instructor
											<ChevronDown className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-56 z-50"
									>
										<DropdownMenuItem asChild>
											<Link href="/dashboard/instructor">
												Dashboard
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href="/dashboard/instructor?tab=create">
												Create Course
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							{userRole === 'homeowner' && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											className="flex items-center gap-1 px-2"
										>
											<Building className="h-4 w-4 mr-1" />
											Homeowner
											<ChevronDown className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link href="/dashboard/homeowner">
												My Properties
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href="/dashboard/homeowner">
												Add Property
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}

							{userRole === 'student' && (
								<Link
									href="/dashboard"
									className={`text-sm font-medium transition-colors hover:text-primary ${
										pathname === '/dashboard' ||
										pathname?.startsWith('/dashboard/')
											? 'text-primary'
											: 'text-muted-foreground'
									}`}
								>
									Dashboard
								</Link>
							)}
						</>
					)}
				</nav>

				<div className="flex items-center gap-2">
					{status === 'authenticated' ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
									<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
										<User className="h-4 w-4 text-primary" />
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									<div className="flex flex-col">
										<span>{session.user?.name}</span>
										<span className="text-xs text-muted-foreground truncate">
											{session.user?.email}
										</span>
										<span className="text-xs text-muted-foreground capitalize mt-1">
											{userRole}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								{/* Role-specific dropdown items */}
								{userRole === 'student' && (
									<DropdownMenuItem asChild>
										<Link href="/dashboard">Dashboard</Link>
									</DropdownMenuItem>
								)}

								{userRole === 'instructor' && (
									<DropdownMenuItem asChild>
										<Link href="/dashboard/instructor">
											Instructor Dashboard
										</Link>
									</DropdownMenuItem>
								)}

								{userRole === 'homeowner' && (
									<DropdownMenuItem asChild>
										<Link href="/dashboard/homeowner">
											Property Dashboard
										</Link>
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Logout</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="hidden sm:flex sm:items-center sm:gap-2">
							<Link href="/login">
								<Button variant="ghost" size="sm">
									Login
								</Button>
							</Link>
							<Link href="/register">
								<Button
									size="sm"
									className="gradient-bg hover:opacity-90"
								>
									Sign Up
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
