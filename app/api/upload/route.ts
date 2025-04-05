import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const type = formData.get('type') as string;
		const weekId = formData.get('weekId') as string;
		const topicId = formData.get('topicId') as string;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file provided' },
				{ status: 400 }
			);
		}

		// Generate a unique filename
		const fileExtension = file.name.split('.').pop();
		const uniqueFilename = `${crypto
			.randomBytes(16)
			.toString('hex')}.${fileExtension}`;

		// Determine upload directory based on type
		let uploadDir: string;
		if (type === 'course-image') {
			uploadDir = join(
				process.cwd(),
				'public',
				'uploads',
				'courses',
				'images'
			);
		} else {
			if (!weekId || !topicId) {
				return NextResponse.json(
					{
						error: 'Week ID and Topic ID are required for course content',
					},
					{ status: 400 }
				);
			}
			uploadDir = join(
				process.cwd(),
				'public',
				'uploads',
				'courses',
				weekId,
				topicId
			);
		}

		// Create directory if it doesn't exist
		await mkdir(uploadDir, { recursive: true });

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Write file to disk
		const filePath = join(uploadDir, uniqueFilename);
		await writeFile(filePath, buffer);

		// Return the public URL
		const publicUrl =
			type === 'course-image'
				? `/uploads/courses/images/${uniqueFilename}`
				: `/uploads/courses/${weekId}/${topicId}/${uniqueFilename}`;

		return NextResponse.json({
			url: publicUrl,
			filename: file.name,
			type: file.type,
		});
	} catch (error) {
		console.error('Error uploading file:', error);
		return NextResponse.json(
			{ error: 'Failed to upload file' },
			{ status: 500 }
		);
	}
}
