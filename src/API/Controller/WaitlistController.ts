import { VerifyOtpDTO } from "@api/DTO";
import { IBaseRequest, RequestWithAuth } from "@api/Utilities/Request";
import { successResponse } from "@api/Utilities/Response";
import { WaitlistUser } from "@domain/Models/Waitlist";
import { NextFunction, RequestHandler, Response } from "express";
import { IWaitlistService } from "Service/WaitlistService";

export class WaitlistController {
    constructor(private service: IWaitlistService) {}

    addToWaitlist: RequestHandler = async (
        req: IBaseRequest<Omit<WaitlistUser, 'userId' | 'emailVerified'>>,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const user = await this.service.addToWaitlist(req.body.data);
	    successResponse(res, 'User added to waitlist successfully', { user })
	} catch (err) {
	    next(err);
	}
    }

    verifyEmail: RequestHandler = async (
        req: IBaseRequest<VerifyOtpDTO>,
	res: Response,
	next: NextFunction
    ) => {
	try {
	    const { data } = req.body;
	    const user = await this.service.verifyWaitlistUserEmail(data.email, data.otp);
	    successResponse(res, 'Waitlist user email verified successfully', { ...user });
	} catch (err) {
            next(err);
	}
    }

    getWaitlist: RequestHandler = async (
        _: RequestWithAuth,
	res: Response,
	next: NextFunction
    ) => {
        try {
	    const users = await this.service.getWaitlistUsers();
	    successResponse(res, 'Waitlist users retrieved successfully', { users });
	} catch (err) {
	    next(err);
	}
    }
}
