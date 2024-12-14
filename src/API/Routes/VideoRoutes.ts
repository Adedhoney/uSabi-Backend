import { VideoController } from "@api/Controller/VideoController";
import { Validation } from "@api/Middleware";
import { VideoSchema } from "@api/Schemas";
import { RequestHandler, Router } from "express";

const router = Router();

export default (videoController: VideoController, authentication: RequestHandler) => {
    router.post('/', authentication, Validation(VideoSchema), videoController.uploadVideo);
    router.put('/:videoId', authentication, videoController.updateUploadedVideo);
    router.delete('/:videoId', authentication, videoController.deleteVideo);

    return router;
}
