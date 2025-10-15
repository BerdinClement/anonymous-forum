import { Message } from "@/types/Message";

class MessageService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  async createMessage(author: string, content: string): Promise<Message> {
	const res = await fetch(`${this.baseUrl}/messages`, {
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
