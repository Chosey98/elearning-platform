'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);

		const formData = new FormData(event.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				toast({
					title: 'Error',
					description: 'Invalid email or password',
					variant: 'destructive',
				});
			} else {
				toast({
					title: 'Success',
					description: 'Logged in successfully',
				});

				// Get the user role from the session
				const response = await fetch('/api/auth/session');
				const session = await response.json();
				const userRole = session?.user?.role;

				// Redirect based on role
				let redirectUrl = '/dashboard';
				if (userRole === 'instructor') {
					redirectUrl = '/dashboard/instructor';
				} else if (userRole === 'homeowner') {
					redirectUrl = '/dashboard/homeowner';
				}

				router.push(redirectUrl);
				router.refresh();
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						Login
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="john@example.com"
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								disabled={isLoading}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
					<div className="mt-4 text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link
							href="/signup"
							className="text-primary hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
