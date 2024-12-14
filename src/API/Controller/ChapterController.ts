import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { Chapter } from "@domain/Models/Chapter";
import { NextFunction, RequestHandler, Response } from "express";
import { IChapterService } from "Service/ChapterService";

export class ChapterController {
    constructor(private readonly service: IChapterService) {}

    createChapter: RequestHandler = async (
        req: IBaseRequest<Partial<Chapter>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const data = req.body.data;
            const chapter = await this.service.createCourseChapter(data);
	    return successResponse(res, `Chapter ${data.position} in Course ${data.courseId} is created successfully`, { chapter });
	} catch (err) {
            next(err);
	}
    };

    updateChapter: RequestHandler = async (
	req: IBaseRequest<Partial<Chapter>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.updateCourseChapter(req.body.data);
	    successResponse(res, 'Chapter was updated successfully');
	} catch (err) {
            next(err);
	}
    };

    fetchChapters: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const chapters = await this.service.fetchCourseChapters(req.params.courseId);
	    successResponse(res, 'Chapters retrieved successfully', { chapters });
	} catch (err) {
	    next(err);
	}
    };

    fetchChapter: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
            const chapter = await this.service.fetchChapter(req.params.chapterId);
	    successResponse(res, 'Chapter retrieved successfully', { chapter });
	} catch (err) {
            next(err);
	}
    };
}
