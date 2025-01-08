import { QuizController } from "@api/Controller/QuizController";
import { RequestHandler, Router } from "express";

const router = Router();

export default (quizCtrl: QuizController, authentication: RequestHandler, adminAuthentication: RequestHandler) => {
    router.post('/', authentication, adminAuthentication, quizCtrl.createQuiz);
    // router.get('/', authentication, quizCtrl.)
    router.get('/:chapterId', authentication, adminAuthentication, quizCtrl.getQuiz);
    router.delete('/:chapterId', authentication, adminAuthentication, quizCtrl.deleteQuiz);

    return router;
}
