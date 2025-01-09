import { VideoController } from "@api/Controller/VideoController";
import { Validation } from "@api/Middleware";
import { VideoSchema } from "@api/Schemas";
import { RequestHandler, Router } from "express";

const router = Router();

export default (videoController: VideoController, authentication: RequestHandler, adminAuthentication: RequestHandler) => {
    router.post('/', authentication, adminAuthentication, Validation(VideoSchema), videoController.uploadVideo);
    router.put('/:videoId', authentication, adminAuthentication, videoController.updateUploadedVideo);
    router.delete('/:videoId', authentication, adminAuthentication, videoController.deleteVideo);

    return router;
}
