import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return new NextResponse('No file provided', { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return new NextResponse(
				'Invalid file type. Only images are allowed.',
				{ status: 400 }
			);
		}

		// Generate a unique filename
		const fileExtension = file.name.split('.').pop();
		const uniqueFilename = `${crypto
			.randomBytes(16)
			.toString('hex')}.${fileExtension}`;

		// Set up upload directory
		const uploadDir = join(
			process.cwd(),
			'public',
			'uploads',
			'housing',
			'images'
		);
		await mkdir(uploadDir, { recursive: true });

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Write file to disk
		const filePath = join(uploadDir, uniqueFilename);
		await writeFile(filePath, buffer);

		// Return the public URL
		const publicUrl = `/uploads/housing/images/${uniqueFilename}`;

		return NextResponse.json({
			url: publicUrl,
			filename: file.name,
			type: file.type,
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return new NextResponse('Error uploading file', { status: 500 });
	}
}
