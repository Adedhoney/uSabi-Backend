import { WaitlistController } from "@api/Controller/WaitlistController";
import { Validation } from "@api/Middleware";
import { JoinWaitlistSchema, VerifyOtpSchema } from "@api/Schemas";
import { Router } from "express";

const router = Router();

/**
 * Waitlist routes
 * @param waitlistCtrl Instance of WaitlistController
 * @returns Configured Router
 */
export default (waitlistCtrl: WaitlistController) => {
    router.post('/', Validation(JoinWaitlistSchema), waitlistCtrl.addToWaitlist);
    router.post('/verify-email', Validation(VerifyOtpSchema), waitlistCtrl.verifyEmail);
    router.get('/list', waitlistCtrl.getWaitlist);

    return router;
}
