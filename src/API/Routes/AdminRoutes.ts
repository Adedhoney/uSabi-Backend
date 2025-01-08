import { RequestHandler, Router } from "express"
import CourseRoutes from "./CourseRoutes"
import { CourseController } from "@api/Controller/CourseController"
import { ChapterController } from "@api/Controller/ChapterController"
import { VideoController } from "@api/Controller/VideoController"
import { QuizController } from "@api/Controller/QuizController"
import ChapterRoutes from "./ChapterRoutes"
import VideoRoutes from "./VideoRoutes"
import QuizRoutes from "./QuizRoutes"

const router = Router()

export default (
    courseController: CourseController, chapterController: ChapterController, videoController: VideoController,
    quizController: QuizController, authentication: RequestHandler, adminAuthentication: RequestHandler
) => {
    router.use('/courses', CourseRoutes(courseController, chapterController, authentication, adminAuthentication));
    router.use('/chapters', ChapterRoutes(chapterController, videoController, authentication, adminAuthentication));
    router.use('/videos', VideoRoutes(videoController, authentication, adminAuthentication));
    router.use('/quiz', QuizRoutes(quizController, authentication, adminAuthentication));

    return router;
}
