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

}