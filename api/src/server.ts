import * as dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';
import mysql from 'mysql';

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
var connection: mysql.Connection = mysql.createConnection({
   host: process.env.MYSQL_HOST,
   port: parseInt(process.env.MYSQL_PORT) || 3306,
   database: process.env.MYSQL_DB,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
});
connection.connect();

// add logger to the database
connection.on('enqueue', function (sequence) {
   if ('Query' === sequence.constructor.name) {
      winstonLogger.info(sequence.sql);
   }
});

// init app
const app = express();

// add middleware
// TODO: create auth middleware

// add routes
// TODO : create controllers and add routes

// start server
const port = process.env.PORT;
app.listen(port, () => {
   console.log(`App listening on the port ${port}`);
});

// on close
connection.end();
