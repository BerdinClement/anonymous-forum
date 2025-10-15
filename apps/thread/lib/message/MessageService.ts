import {Message} from "@/types/Message";

function getBaseUrl(): string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const win = typeof window !== 'undefined' ? (window as any) : undefined;
	if (win && win.__ENV && win.__ENV.NEXT_PUBLIC_API_URL) {
		return win.__ENV.NEXT_PUBLIC_API_URL;
	}

	if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}

	return 'http://localhost:3000';
}

class MessageService {
	async getAllMessages(): Promise<Message[]> {
		const baseUrl = getBaseUrl();
		const res = await fetch(`${baseUrl}/messages`);
		if (!res.ok) {
			throw new Error('Failed to fetch messages');
		}
		return res.json();
	}

	async deleteMessage(id: number): Promise<void> {
		const baseUrl = getBaseUrl();
		const res = await fetch(`${baseUrl}/messages/${id}`, {
			method: 'DELETE',
		});

		if (!res.ok) {
			throw new Error('Failed to delete message');
		}
	}
}

export default new MessageService();
