import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Please enter an email and password');
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user) {
					throw new Error('No user found with this email');
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					throw new Error('Invalid password');
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
		signOut: '/',
		error: '/login',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};
