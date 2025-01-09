import { ChatController } from "@api/Controller/ChatController";
import { RequestHandler, Router } from "express";


const router = Router();

export default (chatController: ChatController, authentication: RequestHandler) => {
    router.post('/', authentication, chatController.chatWithAI);
    router.get('/', authentication, chatController.getChatHistory);

    return router;
}
