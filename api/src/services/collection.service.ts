import { Pool } from 'promise-mysql';
import { CompletionStrategy } from '../models/completion-strategy';


export class CollectionService {

   constructor(
      private readonly db: Pool
   ) { }

   create = async (name: string, startingYear: number, ownerId: number): Promise<any> => {
      return (await this.db.query(
         `INSERT INTO group_collection (name, starting_year, owner_id, join_allowed, completion_strategy) ` +
         `VALUES ?`,
         [
            [
               [
                  name,
                  startingYear,
                  ownerId,
                  false,
                  CompletionStrategy.Random
               ]
            ]
         ]
      )).insertId;
   }

   getAll = async (ownerId: number): Promise<any> => {
      return await this.db.query(
         `SELECT * FROM group_collection WHERE owner_id = ?`,
         [
            ownerId
         ]
      )
   }

   getData = async (collectionId?: number): Promise<any> => {
      const rawGroups = await this.db.query(
         'SELECT gc.id AS collectionId, g.id AS groupId, g.name AS groupName, ' +
         'g.max_seats as maxSeats, g.occupied_seats AS occupiedSeats, ' +
         'gc.join_allowed AS joinAllowed FROM group_collection gc ' +
         'LEFT JOIN student s ON s.group_collection_id = gc.id ' +
         'LEFT JOIN stud_group g ON g.collection_id = gc.id ' +
         (collectionId ? 'WHERE gc.id = ? ' : '') +
         'ORDER BY gc.id, g.id',
         [
            collectionId
         ]
      );

      const rawStudents = await this.db.query(
         'SELECT s.full_name AS name, s.email AS email, s.group_collection_id ' +
         'AS collectionId, s.group_id AS groupId FROM student s ' +
         (collectionId ? 'WHERE s.group_collection_id = ? ' : '') +
         'ORDER BY s.full_name',
         [
            collectionId
         ]
      );

      const result = {};
      for (const row of rawGroups) {
         // add collection object in the result
         if (Object.keys(result).filter(k => k == row.collectionId).length === 0) {
            result[row.collectionId] = {
               unseatedStudents: [],
               joinAllowed: !!row.joinAllowed,
               groups: []
            }
         }

         // add groups object in the result
         const collection = result[row.collectionId];
         if (collection.groups.filter(g => g.id === row.groupId).length === 0) {
            collection.groups.push({
               id: row.groupId,
               name: row.groupName,
               maxSeats: row.maxSeats,
               occupiedSeats: row.occupiedSeats,
               students: []
            });
         }
      };

      // organize students by group
      for (const student of rawStudents) {
         const collection = result[student.collectionId];
         if (student.groupId) {
            collection.groups.filter(g => g.id === student.groupId)[0].students.push({
               name: student.name,
               email: student.email
            });
         } else {
            collection.unseatedStudents.push({
               name: student.name,
               email: student.email
            });
         }
      }

      return collectionId ? result[collectionId] : result;
   }

}