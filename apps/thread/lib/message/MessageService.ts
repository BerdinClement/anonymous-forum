import {Message} from "@/types/Message";
import { config } from "@/config";

class MessageService {
  private baseUrl = config.apiUrl;

  async getAllMessages(): Promise<Message[]> {
	const res = await fetch(`${this.baseUrl}/messages`);
	if (!res.ok) {
	  throw new Error('Failed to fetch messages');
	}
	return res.json();
  }

  async deleteMessage(id: number): Promise<void> {
	const res = await fetch(`${this.baseUrl}/messages/${id}`, {
	  method: 'DELETE',
	});

	if (!res.ok) {
	  throw new Error('Failed to delete message');
	}
  }
}

export default new MessageService();
