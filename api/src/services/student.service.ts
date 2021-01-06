import { Pool } from 'mysql';
import { asyncQuery } from '../util/async-query';
import { v4 as uuid } from 'uuid';


export class StudentService {

   constructor(
      private readonly db: Pool
   ) { }

   enrollStudent = async (collectionId: number, email: string, fullname: string): Promise<any> => {
      return await asyncQuery(
         this.db,
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
      return await asyncQuery(
         this.db,
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
      return await asyncQuery(
         this.db,
         `SELECT * FROM student WHERE group_collection_id = ?`,
         [
            collectionId
         ]
      )
   }

}