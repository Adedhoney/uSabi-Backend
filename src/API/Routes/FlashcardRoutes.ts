import { FlashcardController } from "@api/Controller/FlashcardController";
import { Router, RequestHandler } from "express";

const router = Router();

export default (flashcardController: FlashcardController, authentication: RequestHandler) => {
    router.post('/', authentication, flashcardController.createFlashcard);
    router.put('/:flashcardId', authentication, flashcardController.updateFlashcard);
    // router.delete('/:flashcardId', authentication, flashcardController.);
    router.get('/:flashcardId', authentication, flashcardController.getFlashcard);
    router.get('/', authentication, flashcardController.getFlashcards);

    return router;
}
