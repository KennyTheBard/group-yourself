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
      const connection = await this.db.getConnection();

      await connection.beginTransaction();

      try {
         // lock current student (just in case it has multiple tabs)
         const students = await connection.query(
            'SELECT * FROM student WHERE id = ? AND uuid_code = ? FOR UPDATE',
            [
               studentId,
               studentUuidCode
            ]
         );

         if (students.length === 0) {
            throw new Error('Incorrect student credentials');
         }

         const student = students[0];
         if (student.group_id === groupId) {
            throw new Error('Student already enrolled in this group');
         }

         // lock choosen group and current group if it exists
         const groups = await connection.query(
            'SELECT * FROM stud_group WHERE id IN (?) FOR UPDATE',
            [
               [student.group_id, groupId].filter(id => !!id)
            ]
         )
         const choosenGroup = groups.filter(g => g.id === groupId)[0];
         const currentGroup = groups.filter(g => g.id === student.group_id)[0];

         if (choosenGroup.occupied_seats >= choosenGroup.max_seats) {
            throw new Error('Group already at maximum capacity');
         }

         // update counter for current group if exists
         if (currentGroup) {
            await connection.query(
               'UPDATE stud_group SET occupied_seats = ? WHERE id = ?',
               [
                  currentGroup.occupied_seats - 1,
                  student.group_id
               ]
            )
         }

         // update counter for choosen group
         await connection.query(
            'UPDATE stud_group SET occupied_seats = ? WHERE id = ?',
            [
               choosenGroup.occupied_seats + 1,
               groupId
            ]
         )
         

         // update student group id
         await connection.query(
            'UPDATE student SET group_id = ? WHERE id = ?',
            [
               groupId,
               studentId
            ]
         )

         connection.commit();

      } catch (err) {
         connection.rollback();
         throw new Error(err.message);
      }

   }


}