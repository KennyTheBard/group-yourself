import * as dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';
import mysql from 'mysql';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { OrganizeController } from './controllers/organize.controller';
import { StudentService } from './services/student.service';
import { CollectionService } from './services/collection.service';
import { InstanceManager } from './util/instance-manager';
import { GroupService } from './services/group.service';

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
var dbPool: mysql.Pool = mysql.createPool({
   // database specific
   host: process.env.MYSQL_HOST,
   port: parseInt(process.env.MYSQL_PORT) || 3306,
   database: process.env.MYSQL_DB,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,

   // conncection specific
   connectionLimit : parseInt(process.env.MYSQL_POOL_MAX_SIZE),
   debug: true,
});

// add logger to the database
dbPool.on('enqueue', function (sequence) {
   if ('Query' === sequence.constructor.name) {
      winstonLogger.info(sequence.sql);
   }
});

// init app
const app = express();

// init services
InstanceManager.register(new AuthService(dbPool));
InstanceManager.register(new StudentService(dbPool));
InstanceManager.register(new CollectionService(dbPool));
InstanceManager.register(new GroupService(dbPool));

// add middleware
app.use(express.json());

// init controllers
[
   new AuthController(),
   new OrganizeController()
].forEach(controller => app.use('/api', controller.router))
 
// start server
const port = process.env.PORT;
app.listen(port, () => {
   console.log(`App listening on the port ${port}`);
});
