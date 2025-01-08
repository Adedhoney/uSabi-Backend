import { ChapterController } from "@api/Controller/ChapterController";
import { CourseController } from "@api/Controller/CourseController";
import { UserController } from "@api/Controller/UserController";
import { UserCourseController } from "@api/Controller/UserCourseController";
import { RequestHandler, Router } from "express";

const router = Router();

export default (
    courseController: CourseController, chapterController: ChapterController,
    userCourseController: UserCourseController, authentication: RequestHandler,
    adminAuthentication?: RequestHandler
) => {
    if (adminAuthentication) {
	router.post('/', authentication, adminAuthentication, courseController.createCourse);
        router.get('/:courseId', authentication, adminAuthentication, courseController.getCourse);
        router.put('/:courseId', authentication, adminAuthentication, courseController.updateCourse);
        router.delete('/:courseId', authentication, adminAuthentication, courseController.deleteCourse);
        router.get('/:courseId/chapters', authentication, adminAuthentication, chapterController.fetchChapter);
    }

    router.get('/', authentication, courseController.getAllCourses);
    router.get('/:courseId/full-details', authentication, courseController.getCourseDetails);
    // get all courses full-details

    return router;
};
