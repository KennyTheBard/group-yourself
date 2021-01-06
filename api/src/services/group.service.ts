import { Pool } from 'mysql';
import { asyncQuery } from '../util/async-query';


export class GroupService {

   constructor(
      private readonly db: Pool
   ) { }

   create = async (collectionId: number, name: string, maxSeats: number): Promise<any> => {
      return (await asyncQuery(
         this.db,
         `INSERT INTO stud_group (collection_id, name, max_seats) ` +
         `VALUES ?`,
         [
            [
               [
                  collectionId,
                  name,
                  maxSeats
               ]
            ]
         ]
      )).insertId;
   }

   getGroupsForCollection = async (collectionId: number): Promise<any> => {
      return await asyncQuery(
         this.db,
         `SELECT * FROM stud_group WHERE collection_id = ?`,
         [
            collectionId
         ]
      )
   }

}