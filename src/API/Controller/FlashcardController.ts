import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { Flashcard } from "@domain/Models/Flashcards";
import { NextFunction, RequestHandler, Response } from "express";
import { FlashcardService } from "Service/FlashcardService";

export class FlashcardController {
    constructor(private service: FlashcardService) {}

    getFlashcards: RequestHandler = async (
	_: RequestWithAuth,
	res: Response,
	next: NextFunction,
    ) => {
        try {
            const flashcards = await this.service.getFlashcards();
	    successResponse(res, 'Flashcards retrieved successfully', { flashcards })
	} catch (err) {
            next(err);
	}
    }

    getFlashcard: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction,
    ) => {
        try {
	    const flashcard = await this.service.getFlashcard(req.params.flashcardId);
	    successResponse(res, 'Flashcard retrieved successfully', { flashcard });
	} catch (err) {
            next(err);
	}
    }

    createFlashcard: RequestHandler = async (
        req: IBaseRequest<Flashcard>,
	res: Response,
	next: NextFunction,
    ) => {
	try {
            const flashcard = await this.service.createFlashcard(req.body.data);
	    successResponse(res, 'Flashcard created successfully', { flashcard });
	} catch (err) {
            next(err);
	}
    }

    updateFlashcard: RequestHandler = async (
        req: IBaseRequest<Partial<Flashcard>>,
	res: Response,
	next: NextFunction,
    ) => {
        try {
            await this.service.updateFlashcard(req.params.flashcardId, req.body.data);
	    successResponse(res, 'Flashcard updated successfully');
	} catch (err) {
            next(err);
	}
    }
}
