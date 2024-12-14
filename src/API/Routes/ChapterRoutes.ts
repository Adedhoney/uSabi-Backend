import { ChapterController } from "@api/Controller/ChapterController";
import { RequestHandler, Router } from "express";


const router = Router();

export default (chapterController: ChapterController, authentication: RequestHandler) => {
    router.post('/', authentication, chapterController.createChapter);
    router.get('/:chapterId/', authentication, chapterController.fetchChapter);
    router.put('/:chapterId/', chapterController.updateChapter);

    return router;
}
