import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { Video } from "@domain/Models/Video";
import { NextFunction, RequestHandler, Response } from "express";
import { IVideoService } from "Service/VideoService";


export class VideoController {
    constructor(private readonly service: IVideoService) {}

    uploadVideo: RequestHandler = async (
        req: IBaseRequest<Omit<Video, 'videoId'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const video = await this.service.uploadVideo(req.body.data);
	    successResponse(res, 'Video uploaded successfully', { video });
	} catch (err) {
	    next(err);
	}
    };

    updateUploadedVideo: RequestHandler = async (
        req: IBaseRequest<Partial<Video>>,
	res: Response,
	next: NextFunction
    ) => {
	try {
	    await this.service.updateVideo(req.body.data);
	    successResponse(res, 'Video updated successfully');
	} catch (err) {
	    next(err);
	}
    };

    getVideo: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const video = await this.service.fetchVideo(req.params.videoId);
	    successResponse(res, 'Video retrieved successfully', { video });
	} catch (err) {
	    next(err);
	}
    };

    getVideosInAChapter: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const chapterId = req.params.chapterId;
	    const videos = await this.service.fetchChapterVideos(chapterId);
	    successResponse(res, `Videos in Chapter ${chapterId} retrieved successfully`, { videos });
	} catch (err) {
	    next(err);
	}
    };

    deleteVideo: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.deleteVideo(req.params.videoId);
	    successResponse(res, 'Video deleted successfully');
	} catch (err) {
	    next(err);
	}
    };
}
