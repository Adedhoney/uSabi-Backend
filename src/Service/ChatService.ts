import { generateRandomId, getCurrentTimeStamp } from "@application/utilities";
import { Chat } from "@domain/Models";
import { ChatRepository } from "@domain/Repositories/ChatRepository";
import { generateChatResponse } from "AI/services/aiChatService";

export interface IChatService {
    getResponse(userMessage: string, userId: string): Promise<string>;
}

export class ChatService implements IChatService {
    constructor(private chatRepo: ChatRepository) {}

    async getResponse(userMessage: string, userId: string): Promise<string> {
	const conversationHistory = await this.chatRepo.getUserConversations(userId);
	const aiResponse = await generateChatResponse(userMessage, conversationHistory);
	await this.saveConversation(userId, userMessage, aiResponse);
	return aiResponse;
    }

    async saveConversation(userId: string, userMessage: string, aiResponse: string): Promise<void> {
	const chat = {
            chatId: generateRandomId(),
	    createdAt: getCurrentTimeStamp(),
	    userId, userMessage, aiResponse,
	}
	await this.chatRepo.saveUserMessage(chat);
    }
}
