import { UserController } from '@api/Controller/UserController';
import { UserCourseController } from '@api/Controller/UserCourseController';
import { Validation } from 'API/Middleware';
import {
    OnboardingSchema,
    ResetPasswordSchema,
    UpdatePassWordSchema,
} from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (
    userctr: UserController, userCourseController: UserCourseController,
    authentication: RequestHandler
) => {
    // router.put('/', authentication, Validation(UpdateInfoSchema), userctr.updateInfo);

    router.get('/', authentication, userctr.getUser);
    router.get('/:userId', authentication, userctr.getUserById);
    router.post('/update-password', authentication, Validation(UpdatePassWordSchema),
		userctr.updatePassword);
    router.post('/reset-password', Validation(ResetPasswordSchema), userctr.resetPassword);
    router.put('/', authentication, Validation(OnboardingSchema), userctr.updateUser);
    //get subscriptions
    //get courses regardless of being enrolled
    router.get('/courses', authentication, userCourseController.getUserEnrolledCourses);
    router.put('/courses/:courseId', authentication, userCourseController.updateUserCourse);
    router.post('/courses/:courseId/enrol', authentication, userCourseController.enrolUser);
    router.get('/courses/:courseId/enrolment-status', authentication, userCourseController.isUserEnrolled);

    return router;
};
