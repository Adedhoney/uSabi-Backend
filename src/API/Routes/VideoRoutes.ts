import { VideoController } from "@api/Controller/VideoController";
import { RequestHandler, Router } from "express";

const router = Router();

export default (videoController: VideoController, authentication: RequestHandler) => {
    router.post('/', authentication, videoController.uploadVideo);
    router.put('/:videoId', authentication, videoController.updateUploadedVideo);
    router.delete('/:videoId', authentication, videoController.deleteVideo);

    return router;
}
