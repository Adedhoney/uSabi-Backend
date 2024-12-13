import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { Course } from "@domain/Models/Course";
import { ICourseService } from "Service/CourseService";
import { Response, RequestHandler, NextFunction } from "express";

export class CourseController {
    constructor(private readonly service: ICourseService) {}

    createCourse: RequestHandler = async (
        req: IBaseRequest<Omit<Course, 'courseId' | 'createdAt'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
            const course = await this.service.createCourse(req.body.data);
	    successResponse(res, 'Course created successfully', { course });
	} catch (err) {
            next(err);
	}
    };

    updateCourse: RequestHandler = async (
        req: IBaseRequest<Partial<Course>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
            await this.service.updateCourse(req.body.data);
	    successResponse(res, 'Course updated successfully');
	} catch (err) {
            next(err);
	}
    };

    getAllCourses: RequestHandler = async (
	_: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
            const courses = await this.service.fetchAllCourses();
	    return successResponse(res, 'Courses retrieved successfully', { courses });
	} catch (err) {
            next(err);
	}
    };

    getCourse: RequestHandler = async (
	req: RequestWithAuth, res: Response, next: NextFunction
    ) => {
        try {
            const course = await this.service.fetchCourse(req.params.courseId);
	    return successResponse(res, 'Course retrieved successfully', { course });
	} catch (err) {
            next(err);
	}
    };

    deleteCourse: RequestHandler = async (
	req: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
            await this.service.deleteCourse(req.params.courseId);
	    successResponse(res, 'Course deleted successfully');
	} catch (err) {
            next(err);
	}
    };
}
