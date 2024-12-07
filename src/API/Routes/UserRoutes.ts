import { UserController } from '@api/Controller/UserController';
import { Validation } from 'API/Middleware';
import {
    ResetPasswordSchema,
    UpdateInfoSchema,
    UpdatePassWordSchema,
} from 'API/Schemas';
import { RequestHandler, Router } from 'express';

const router = Router();

export default (userctr: UserController, authentication: RequestHandler) => {
    router.put(
        '/',
        authentication,
        Validation(UpdateInfoSchema),
        userctr.updateInfo,
    );

    router.put(
        '/:userId',
        authentication,
	userctr.updateUser,
    );

    router.post(
        '/update-password',
        authentication,
        Validation(UpdatePassWordSchema),
        userctr.updatePassword,
    );

    router.get('/', authentication, userctr.getUser);
    router.get('/:userId', authentication, userctr.getUserById);

    router.post(
        '/reset-password',
        Validation(ResetPasswordSchema),
        userctr.resetPassword,
    );

    //get subscriptions

    return router;
};
