import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { Quiz } from "@domain/Models/Quiz";
import { NextFunction, RequestHandler, Response } from "express";
import { IQuizService } from "Service/QuizService";

export class QuizController {
    constructor(private service: IQuizService) {}

    createQuiz: RequestHandler = async (
        req: IBaseRequest<Omit<Quiz, 'qId' | 'qas' | 'createdAt'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const quiz = await this.service.addQuiz(
		req.body.data, req.auth!.userId, Number(req.params.numberOfQuestions)
	    );
	    successResponse(res, 'Quiz created successfully', { quiz });
	} catch (err) {
	    next(err);
	}
    }

    getQuiz: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const quiz = await this.service.fetchQuiz(req.params.chapterId);
	    successResponse(res, 'Quiz retrieved successfully', { quiz });
	} catch (err) {
            next(err);
	}
    }

    deleteQuiz: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.deleteQuiz(req.params.chapterId);
	    successResponse(res, 'Quiz deleted successfully');
	} catch (err) {
            next(err);
	}
    }
}
