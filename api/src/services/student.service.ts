import { Connection, MysqlError, Pool, PoolConnection } from 'promise-mysql';
import { v4 as uuid } from 'uuid';


export class StudentService {

   constructor(
      private readonly db: Pool
   ) { }

   enrollStudent = async (collectionId: number, email: string, fullname: string): Promise<any> => {
      return await this.db.query(
         `INSERT INTO student (uuid_code, email, full_name, group_collection_id) ` +
         `VALUES ?`,
         [
            [
               [
                  uuid().replace(/-/g, ''),
                  email,
                  fullname,
                  collectionId,
               ]
            ]
         ]
      );
   }

   enrollStudents = async (collectionId: number, students: Record<string, string>[]): Promise<any> => {
      return await this.db.query(
         `INSERT INTO student (uuid_code, email, full_name, group_collection_id) ` +
         `VALUES ?`,
         [
            students
               .map(s => [s.email, s.fullname, collectionId])
               .map(s => {
                  s.unshift(uuid().replace(/-/g, ''));
                  return s;
               })
         ]
      );
   }

   getStudentsForCollection = async (collectionId: number): Promise<any> => {
      return await this.db.query(
         `SELECT * FROM student WHERE group_collection_id = ?`,
         [
            collectionId
         ]
      )
   }

   enrollInGroup = async (studentId: number, studentUuidCode: string, groupId: number): Promise<any> => {
      // const result = await asyncGetConnection(this.db);
      // const err = result as MysqlError;
      // const connection = result as Connection;

      // if (err.errno) {
      //    throw new Error(err.sqlMessage)
      // }

      // await (async () => {
      //    const deferred = q.defer<any>();

      //    // execute enrollment logic in transaction
      //    connection.beginTransaction((err) => {
      //       if (err) {
      //          deferred.reject(err);
      //       }
            
      //       await asyncQuery(
      //          connection,
      //          '',
      //          [

      //          ]
      //       )
            
      //       deferred.resolve(connection);
      //    });
   
      //    return deferred.promise;
      // })();
   }
   

}