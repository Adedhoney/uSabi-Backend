import { AccountController } from '@api/Controller';
import { AccountRepository, OTPRepository } from '@domain/Repositories';
import { Database } from '@infrastructure/Database';
import { IO } from '@infrastructure/Websocket';
import { Router } from 'express';
import { AccountNotification } from 'Handlers/Notification';
import { AccountService, FlashcardService } from 'Service';
import { Server } from 'socket.io';
import { Authentication } from '@api/Middleware';
import AccountRoutes from './AccountRoutes';
import UserRoutes from './UserRoutes';
import { UserController } from '@api/Controller/UserController';
import UserFlashcardRoutes from './UserFlashcardRoutes';
import { UserService } from 'Service/UserService';
import { UserFlashcardController } from '@api/Controller/UserFlashcardController';
import { UserFlashcardService } from 'Service/UserFlashcardService';
import { UserFlashcardReopository } from '@domain/Repositories/UserFlashcardRepository';
import FlashcardRoutes from './FlashcardRoutes';
import { FlashcardController } from '@api/Controller/FlashcardController';
import { FlashcardRepository } from '@domain/Repositories/FlashcardRepository';
import { CourseRepository } from '@domain/Repositories/CourseRepository';
import { CourseController } from '@api/Controller/CourseController';
import { CourseService } from 'Service/CourseService';
import CourseRoutes from './CourseRoutes';
import { ChapterRepository } from '@domain/Repositories/ChapterRepository';
import { ChapterController } from '@api/Controller/ChapterController';
import { ChapterService } from 'Service/ChapterService';
import ChapterRoutes from './ChapterRoutes';
import { VideoRepository } from '@domain/Repositories/VideoRepository';
import { VideoController } from '@api/Controller/VideoController';
import { VideoService } from 'Service/VideoService';
import VideoRoutes from './VideoRoutes';
import WaitlistRoutes from './WaitlistRoutes';
import { WaitlistRepository } from '@domain/Repositories/WaitlistRepository';
import { WaitlistController } from '@api/Controller/WaitlistController';
import { WaitlistService } from 'Service/WaitlistService';

const router = Router();

const database = new Database();
const acctrepo = new AccountRepository(database);
const waitlistrepo = new WaitlistRepository(database);
const otprepo = new OTPRepository(database);
const courserepo = new CourseRepository(database);
const chapterrepo = new ChapterRepository(database);
const videoRepo = new VideoRepository(database);
const flashcardrepo = new FlashcardRepository(database);
const userflshcrdrepo = new UserFlashcardReopository(database);

const acctNotification = new AccountNotification();

const Auth = Authentication(acctrepo);
const acctctr = new AccountController(
    new AccountService(acctrepo, otprepo, acctNotification),
);
const waitlistctr = new WaitlistController(new WaitlistService(waitlistrepo, otprepo, acctNotification));
const userctr = new UserController(new UserService(acctrepo));
const coursectrl = new CourseController(new CourseService(courserepo));
const chapterctrl = new ChapterController(new ChapterService(chapterrepo));
const videoctrl = new VideoController(new VideoService(videoRepo));
const flashcardctr = new FlashcardController(new FlashcardService(flashcardrepo));
const userflshcrdctrl = new UserFlashcardController(
    new UserFlashcardService(userflshcrdrepo)
);

const io = new Server();
// const io_obj = new IO(io);

router.use('/accounts', AccountRoutes(acctctr, Auth));
router.use('/users', UserRoutes(userctr, Auth));
router.use('/waitlist', WaitlistRoutes(waitlistctr));
router.use('/courses', CourseRoutes(coursectrl, chapterctrl, Auth));
router.use('/chapters', ChapterRoutes(chapterctrl, videoctrl, Auth));
router.use('/videos', VideoRoutes(videoctrl, Auth));
router.use('/flashcards', FlashcardRoutes(flashcardctr, Auth));
router.use('/users/flashcards', UserFlashcardRoutes(userflshcrdctrl, Auth));
// router.use('/users/courses', )

export { router, io };
