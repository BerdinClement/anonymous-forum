import { Message } from "@/types/Message";

function getBaseUrl(): string {
	// Prefer runtime-injected window.__ENV (injected by app/layout.tsx) so containers
	// can set NEXT_PUBLIC_API_URL at start. Fall back to process.env for dev/build and
	// finally to localhost for safety.
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
	async createMessage(author: string, content: string): Promise<Message> {
		const baseUrl = getBaseUrl();
		const res = await fetch(`${baseUrl}/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ author, content }),
		});

		if (!res.ok) {
			throw new Error('Failed to create message');
		}

		return res.json();
	}
}

export default new MessageService();
