import { UserFlashcardController } from "@api/Controller/UserFlashcardController";
import { RequestHandler, Router } from "express";


const router = Router();

export default (userflshcrdctrl: UserFlashcardController, authentication: RequestHandler) => {
    router.get('/', authentication, userflshcrdctrl.getUserFlashcards);
    router.get('/:flashcardId', authentication, userflshcrdctrl.getUserFlashcard);
    router.post('/:flashcardId', authentication, userflshcrdctrl.createUserFlashcard);
    router.patch('/:flashcardId', authentication, userflshcrdctrl.updateUserFlashcard);

    return router;
}
