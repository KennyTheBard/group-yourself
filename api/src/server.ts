import * as dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';
import mysql from 'mysql';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

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
   connectionLimit : parseInt(process.env.MYSQL_POOL_MAX_SIZE),
   host: process.env.MYSQL_HOST,
   port: parseInt(process.env.MYSQL_PORT) || 3306,
   database: process.env.MYSQL_DB,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
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
const services = new Map<Object, Object>();
services.set(AuthService.constructor, new AuthService(dbPool));

// add middleware
app.use(express.json());

// init controllers
[
   new AuthController(services)
].forEach(controller => app.use('/api', controller.router))
 
// start server
const port = process.env.PORT;
app.listen(port, () => {
   console.log(`App listening on the port ${port}`);
});
