import { Chat } from "@domain/Models/Chat";
import { IDatabase } from "@infrastructure/Database";

export interface IChatRepository {
    saveUserMessage(chat: Chat): Promise<void>;
    getUserConversations(userId: string, limit: number): Promise<Chat[]>;
}

export class ChatRepository implements IChatRepository {
    constructor(private readonly db: IDatabase) {}

    async saveUserMessage(chat: Chat): Promise<void> {
        await this.db.execute(
	    `INSERT INTO chat (chatId, userId, userMessage, aiResponse, createdAt)
	    VALUES (?,?,?,?,?)`,
	    [
		chat.chatId, chat.userId,
		chat.userMessage, chat.aiResponse, chat.createdAt
	    ]
	);
    }

    async getUserConversations(userId: string, limit: number = 999999): Promise<Chat[]> {
	const conversations = await this.db.execute(
	    `SELECT *
	    FROM chat
	    WHERE userId=?
	    ORDER BY createdAt ASC
	    LIMIT ?`,
	    [userId, limit]
	);
	return conversations as Chat[];
    }
}
