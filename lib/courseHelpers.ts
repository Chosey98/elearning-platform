import { toast } from '@/components/ui/use-toast';

interface Course {
	id?: string;
	title: string;
	description: string;
	fullDescription: string;
	level: string;
	category: string;
	duration: string;
	price: string;
	imageUrl: string;
	syllabus: Week[];
	requirements: string[];
	whatYouWillLearn: string[];
	instructorId: string;
	lastUpdated: string;
	language: string;
}

interface TopicContent {
	type: 'video' | 'file';
	title: string;
	url: string;
	fileType?: string;
	duration?: string;
}

interface Topic {
	id: string;
	title: string;
	content: TopicContent[];
}

interface Week {
	week: number;
	title: string;
	topics: Topic[];
	duration: string;
}

export const handleImageUpload = async (
	file: File,
	currentFormData: Course,
	setFormData: (data: Course) => void
) => {
	try {
		const formDataToSend = new FormData();
		formDataToSend.append('file', file);
		formDataToSend.append('type', 'course-image');

		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formDataToSend,
		});

		if (!response.ok) {
			throw new Error('Failed to upload image');
		}

		const data = await response.json();
		setFormData({
			...currentFormData,
			imageUrl: data.url,
		});

		toast({
			title: 'Success',
			description: 'Course image uploaded successfully',
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		toast({
			title: 'Error',
			description: 'Failed to upload image. Please try again.',
			variant: 'destructive',
		});
	}
};
