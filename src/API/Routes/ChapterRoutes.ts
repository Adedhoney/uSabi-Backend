import { ChapterController } from "@api/Controller/ChapterController";
import { VideoController } from "@api/Controller/VideoController";
import { RequestHandler, Router } from "express";


const router = Router();

export default (
    chapterController: ChapterController, videoController: VideoController,
    authentication: RequestHandler, adminAuthentication: RequestHandler
) => {
    router.post('/', authentication, adminAuthentication, chapterController.createChapter);
    router.get('/:chapterId/', authentication, adminAuthentication, chapterController.fetchChapter);
    router.put('/:chapterId/', adminAuthentication, chapterController.updateChapter);
    router.get('/:chapterId/video', adminAuthentication, videoController.getVideo);

    return router;
}
