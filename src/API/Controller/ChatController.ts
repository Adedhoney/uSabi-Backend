import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { NextFunction, RequestHandler, Response } from "express";
import { IChatService } from "Service/ChatService";


export class ChatController {
    constructor(private readonly service: IChatService) {}

    chatWithAI: RequestHandler = async (
        req: IBaseRequest<string>,
	res: Response,
	next: NextFunction
    ) => {
        try {
            const aiResponse = await this.service.getResponse(req.body.data, req.auth!.userId);
	    successResponse(
		res, 'AI response retrieved and conversation recorded successfully', { aiResponse }
	    );
	} catch (err) {
            next(err);
	}
    }

    getChatHistory: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const chats = await this.service.getConversationHistory(req.auth!.userId, req.query.limit as string);
	    successResponse(res, 'Chat history is retrieved successfully', { chats });
	} catch (err) {
            next(err);
	}
    }
}
