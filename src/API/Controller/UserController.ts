import { IBaseRequest, RequestWithAuth } from '../Utilities/Request';
import { User } from '@domain/Models';
import { successResponse } from '../Utilities/Response';
import {
    ResetPasswordDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
} from 'API/DTO';
import { IUserService } from 'Service';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export class UserController {
    constructor(private service: IUserService) {
        this.service = service;
    }

    getUser: RequestHandler = async (
        req: RequestWithAuth,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(req.auth!);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    getUserById: RequestHandler = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUserById(req.params.userId);

            return successResponse(res, 'Successful', { user });
        } catch (err) {
            next(err);
        }
    };

    updateInfo: RequestHandler = async (
        req: IBaseRequest<UpdateInfoDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdateInfo(req.body.data, req.auth!);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    updateUser: RequestHandler = async (
        req: IBaseRequest<Pick<User, 'languagePreference' | 'learningStyle' | 'aiResponse' | 'learningDuration' | 'avatar'>>,
	res: Response,
	next: NextFunction,
    ) => {
        try {
            await this.service.UpdateDetails(
                req.body.data,
		res.locals.authData,
	    );

	    return successResponse(res, 'Successful');
	} catch (err) {
            next(err);
	}
    }

    updatePassword: RequestHandler = async (
        req: IBaseRequest<UpdatePassWordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdatePassword(req.body.data, req.auth!);

            return successResponse(res, 'Successful');
        } catch (err) {
            next(err);
        }
    };

    resetPassword: RequestHandler = async (
        req: IBaseRequest<ResetPasswordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.ResetPassword(req.body.data);
            return successResponse(res, `Password reset successful`);
        } catch (err) {
            next(err);
        }
    };
}
