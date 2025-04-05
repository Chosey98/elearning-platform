'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countries';

export default function RegisterPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: {
			dialCode: '+1',
			number: '',
		},
		nationality: '',
		role: 'student',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePhoneChange = (value: { dialCode: string; number: string }) => {
		setFormData((prev) => ({ ...prev, phone: value }));
	};

	const handleNationalityChange = (value: string) => {
		setFormData((prev) => ({ ...prev, nationality: value }));
	};

	const handleRoleChange = (value: string) => {
		setFormData((prev) => ({ ...prev, role: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validate form
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: "Passwords don't match",
				description: 'Please make sure your passwords match.',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		if (!formData.phone.number) {
			toast({
				title: 'Phone number required',
				description: 'Please enter your phone number.',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		if (!formData.nationality) {
			toast({
				title: 'Nationality required',
				description: 'Please select your nationality.',
				variant: 'destructive',
			});
			setIsLoading(false);
			return;
		}

		try {
			// Register user
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
					phone: `${formData.phone.dialCode}${formData.phone.number}`,
					nationality: formData.nationality,
					role: formData.role,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Something went wrong');
			}

			// Sign in the user
			const result = await signIn('credentials', {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			toast({
				title: 'Account created!',
				description: 'You have successfully registered.',
			});

			router.push('/dashboard');
		} catch (error) {
			toast({
				title: 'Something went wrong',
				description:
					error instanceof Error
						? error.message
						: 'Please try again later.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 light-gradient-1">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
			</div>

			<Card className="w-full max-w-md relative z-10 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-2">
						<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<Sparkles className="h-6 w-6 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl text-center gradient-text">
						Create an account
					</CardTitle>
					<CardDescription className="text-center">
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								name="name"
								placeholder="John Doe"
								required
								value={formData.name}
								onChange={handleChange}
								className="border-primary/20 focus-visible:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="john@example.com"
								required
								value={formData.email}
								onChange={handleChange}
								className="border-primary/20 focus-visible:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<PhoneInput
								value={formData.phone}
								onChange={handlePhoneChange}
								className="border-primary/20 focus-visible:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="nationality">Nationality</Label>
							<Select
								value={formData.nationality}
								onValueChange={handleNationalityChange}
							>
								<SelectTrigger className="border-primary/20 focus-visible:ring-primary">
									<SelectValue placeholder="Select your nationality" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{countries.map((country) => (
										<SelectItem
											key={country.code}
											value={country.name}
										>
											{country.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>I am a</Label>
							<RadioGroup
								value={formData.role}
								onValueChange={handleRoleChange}
								className="flex space-x-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="student"
										id="student"
									/>
									<Label htmlFor="student">Student</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="instructor"
										id="instructor"
									/>
									<Label htmlFor="instructor">
										Instructor
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="homeowner"
										id="homeowner"
									/>
									<Label htmlFor="homeowner">
										Home Owner
									</Label>
								</div>
							</RadioGroup>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								value={formData.password}
								onChange={handleChange}
								className="border-primary/20 focus-visible:ring-primary"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="border-primary/20 focus-visible:ring-primary"
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button
							className="w-full gradient-bg hover:opacity-90 transition-opacity"
							type="submit"
							disabled={isLoading}
						>
							{isLoading
								? 'Creating account...'
								: 'Create account'}
						</Button>
						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link
								href="/login"
								className="text-primary font-medium hover:underline"
							>
								Sign in
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
