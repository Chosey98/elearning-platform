import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	// Create instructor user
	const hashedPassword = await hash('password123', 12);
	const instructor = await prisma.user.create({
		data: {
			name: 'Test Instructor',
			email: 'instructor@test.com',
			password: hashedPassword,
			role: 'instructor',
		},
	});

	console.log('Created instructor:', instructor);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
