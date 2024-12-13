import { CourseController } from "@api/Controller/CourseController";
import { RequestHandler, Router } from "express";

const router = Router();

export default (courseController: CourseController, authentication: RequestHandler) => {
    router.post('/', authentication, courseController.createCourse);
    router.get('/', authentication, courseController.getAllCourses);
    router.get('/:courseId', authentication, courseController.getCourse);
    router.put('/:courseId', authentication, courseController.updateCourse);
    router.delete('/:courseId', authentication, courseController.deleteCourse);

    return router;
};