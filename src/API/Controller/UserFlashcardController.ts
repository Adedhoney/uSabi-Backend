import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { UserFlashcard } from "@domain/Models/UserFlashcards";
import { NextFunction, RequestHandler, Response } from "express";
import { IUserFlashcardService } from "Service/UserFlashcardService";

export class UserFlashcardController {
    constructor(private service: IUserFlashcardService) {
        this.service = service;
    }

    createUserFlashcard: RequestHandler = async (
	req: IBaseRequest<Omit<UserFlashcard, 'progress.completed'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.createUserFlashcard(req.body.data);
	    return successResponse(res, 'Successful');
	} catch (err) {
            next(err);
	}
    }

    updateUserFlashcard: RequestHandler = async (
        req: IBaseRequest<Partial<UserFlashcard>>,
	res: Response,
	next: NextFunction,
    ) => {
	try {
            await this.service.updateUserFlashcard(req.body.data);
	    successResponse(res, 'Successful');
	} catch (err) {
            next(err);
	}
    }

    getUserFlashcard: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction,
    ) => {
        try {
	    const userFlashcard = await this.service.getUserFlashcard(
		req.auth!.userId, req.params.flashcardId);
	    successResponse(res, 'Successful', { userFlashcard });
	} catch (err) {
            next(err);
	}
    }

    getUserFlashcards: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction,
    ) => {
        try {
            const userFlashCards = await this.service.getUserFlashcards(
		req.auth!.userId);
	    successResponse(res, 'Successful', userFlashCards);
	} catch (err) {
            next(err);
	}
    }
}
