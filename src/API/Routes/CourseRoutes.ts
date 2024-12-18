import { ChapterController } from "@api/Controller/ChapterController";
import { CourseController } from "@api/Controller/CourseController";
import { RequestHandler, Router } from "express";

const router = Router();

export default (
    courseController: CourseController, chapterController: ChapterController,
    authentication: RequestHandler
) => {
    router.post('/', authentication, courseController.createCourse);
    router.get('/', authentication, courseController.getAllCourses);
    router.get('/:courseId', authentication, courseController.getCourse);
    router.put('/:courseId', authentication, courseController.updateCourse);
    router.delete('/:courseId', authentication, courseController.deleteCourse);
    router.get('/:courseId/chapters', authentication, chapterController.fetchChapter);

    router.get('/:courseId/full-details', authentication, courseController.getCourseDetails);

    return router;
};
