import { RequestWithAuth } from '@api/Utilities/Request';
import {
    CustomError,
    InvalidTokenError,
    TokenExpiredError,
} from '@application/error';
import { StatusCode, verifyAuthToken } from '@application/utilities';
import { Permission } from '@domain/Models';
import { IAccountRepository } from '@domain/Repositories';

import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

export const Authentication =
    (acctrepo: IAccountRepository) =>
    async (req: RequestWithAuth, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return next(
                    new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
                );
            }
            const validate = verifyAuthToken(token);
            const authData = await acctrepo.getUserById(validate.userId);
            if (!authData)
                return next(
                    new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),
                );

            req.auth = authData;
            next();
        } catch (err: JsonWebTokenError | any) {
            if (
                err instanceof JsonWebTokenError &&
                err.message == 'invalid signature'
            ) {
                return next(new InvalidTokenError());
            }

            return next(new TokenExpiredError());
        }
    };

    export const AdminAuthentication = () => async (
        req: RequestWithAuth, _: Response, next: NextFunction
    ) => {
	if (req.auth && req.auth.permission === Permission.ADMIN) {
            next();
	}
	return next(new CustomError('Unauthorized', StatusCode.UNAUTHORIZED),);
    }
