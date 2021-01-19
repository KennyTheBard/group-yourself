import { NotificationService } from './services/notification.service';
import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import * as cron from 'node-cron';
import express from 'express';
import winston from 'winston';
import mysql from 'promise-mysql';
import expressWs from 'express-ws';
import cors from 'cors';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { OrganizerController } from './controllers/organizer.controller';
import { StudentService } from './services/student.service';
import { CollectionService } from './services/collection.service';
import { InstanceManager } from './util/instance-manager';
import { GroupService } from './services/group.service';
import { ConfigService } from './services/config.service';
import { StudentController } from './controllers/student.controller';
import { MailService } from './services/mail.service';
import { WebsocketService } from './services/websocket.service';
import { RealTimeService } from './services/real-time.service';

const init = async () => {

   // load environment vars
   dotenv.config();

   // configure logger
   const winstonLogger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
         winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
         }),
         winston.format((info) => {
            info.message = `[${(info.level as string).toUpperCase()}] ${info.timestamp} : ${info.message}`;

            return info;
         })(),
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
         new winston.transports.Console({
            format: winston.format.printf(info => `${info.message}`)
         }),
      ],
   });

   // connect to the database
   var dbPool: mysql.Pool = await mysql.createPool({
      // database specific
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT) || 3306,
      database: process.env.MYSQL_DB,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,

      // conncection specific
      connectionLimit: parseInt(process.env.MYSQL_POOL_MAX_SIZE),
      debug: process.env.ENABLE_DB_DEBUG === 'true',
   });

   // add logger to the database
   dbPool.on('enqueue', function (sequence) {
      if ('Query' === sequence.constructor.name) {
         winstonLogger.info(sequence.sql);
      }
   });

   // create a SMTP transport with gmail credentials
   const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
         user: process.env.GMAIL_USERNAME,
         pass: process.env.GMAIL_PASSWORD
      }
   });

   // init app with an websocket server
   const { app, getWss, applyTo } = expressWs(express());
   const router = express.Router() as expressWs.Router;
   app.use('/', router);

   // init services
   InstanceManager.register(new AuthService(dbPool));
   InstanceManager.register(new StudentService(dbPool));
   InstanceManager.register(new CollectionService(dbPool));
   InstanceManager.register(new GroupService(dbPool));
   InstanceManager.register(new ConfigService(dbPool));
   InstanceManager.register(new MailService(smtpTransport));
   InstanceManager.register(new WebsocketService(router));
   const realTimeService = InstanceManager.register(new RealTimeService(dbPool));
   InstanceManager.register(new NotificationService());

   // add middleware
   app.use(express.json());
   app.use(cors());

   // init controllers
   [
      new AuthController(),
      new OrganizerController(),
      new StudentController()
   ].forEach(controller => app.use('/api', controller.router))

   // schedule the task to update subscribers
   cron.schedule('*/5 * * * * *', () => {
      realTimeService.updateSubscribers();
   });

   // start server
   const port = process.env.PORT;
   app.listen(port, () => {
      console.log(`App listening on the port ${port}`);
   });
};

init();