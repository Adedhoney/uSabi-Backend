import { ChapterController } from "@api/Controller/ChapterController";
import { VideoController } from "@api/Controller/VideoController";
import { RequestHandler, Router } from "express";


const router = Router();

export default (
    chapterController: ChapterController, videoController: VideoController,
    authentication: RequestHandler
) => {
    router.post('/', authentication, chapterController.createChapter);
    router.get('/:chapterId/', authentication, chapterController.fetchChapter);
    router.put('/:chapterId/', chapterController.updateChapter);
    router.get('/:chapterId/video', videoController.getVideo);

    return router;
}
