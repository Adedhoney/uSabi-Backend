import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { UserCourse } from "@domain/Models/UserCourse";
import { NextFunction, RequestHandler, Response } from "express";
import { IUserCourseService } from "Service/UserCourseService";


export class UserCourseController {
    constructor(private readonly service: IUserCourseService) {}

    enrolUser: RequestHandler = async(
        req: IBaseRequest<Omit<UserCourse, 'completed' | 'enrolledAt' | 'updatedAt'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.enrolCourse(req.body.data);
	    successResponse(res, 'Course enrolled successfully');
	} catch (err) {
            next(err);
	}
    }

    getUserEnrolledCourses: RequestHandler = async(
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const enrolledCourses = await this.service.getEnrolledCourses(req.auth!.userId);
	    successResponse(res, 'Enrolled courses retrieved successfully', { enrolledCourses });
	} catch (err) {
            next(err);
	}
    }

    isUserEnrolled: RequestHandler = async (
        req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const isUserEnrolled = await this.service.isUserEnrolled(
		req.auth!.userId, req.params.courseId
	    );
	    successResponse(res, 'User enrollment status retrieved successfully', { isUserEnrolled });
	} catch (err) {
            next(err);
	}
    }

    updateUserCourse: RequestHandler = async (
        req: IBaseRequest<Pick<UserCourse, 'completed'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    await this.service.updateUserCourse(req.body.data);
	    successResponse(res, 'User course updated successfully');
	} catch (err) {
	    next(err);
	}
    }
}
