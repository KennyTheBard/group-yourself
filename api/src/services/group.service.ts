import { Pool } from 'promise-mysql';


export class GroupService {

   constructor(
      private readonly db: Pool
   ) { }

   create = async (collectionId: number, name: string, maxSeats: number): Promise<any> => {
      return (await this.db.query(
         'INSERT INTO stud_group (collection_id, name, max_seats, occupied_seats) ' +
         'VALUES ?',
         [
            [
               [
                  collectionId,
                  name,
                  maxSeats,
                  0
               ]
            ]
         ]
      )).insertId;
   }

   getGroupsForCollection = async (collectionId: number): Promise<any> => {
      return await this.db.query(
         'SELECT id, name, occupied_seats, max_seats ' +
         'FROM stud_group WHERE collection_id = ?',
         [
            collectionId
         ]
      )
   }

}