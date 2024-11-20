import { AccountController } from '@api/Controller';
import { AccountRepository, OTPRepository } from '@domain/Repositories';
import { Database } from '@infrastructure/Database';
import { IO } from '@infrastructure/Websocket';
import { Router } from 'express';
import { AccountNotification } from 'Handlers/Notification';
import { AccountService } from 'Service';
import { Server } from 'socket.io';
import AccountRoutes from './AccountRoutes';
import { Authentication } from '@api/Middleware';

const router = Router();

const database = new Database();
const acctrepo = new AccountRepository(database);

const otprepo = new OTPRepository(database);

const acctNotification = new AccountNotification();

const acctctr = new AccountController(
    new AccountService(acctrepo, otprepo, acctNotification),
);
const Auth = Authentication(acctrepo);

const io = new Server();

// const io_obj = new IO(io);

router.use('/accounts', AccountRoutes(acctctr, Auth));

export { router, io };
