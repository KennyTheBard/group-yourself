import { Pool } from 'mysql';
import { asyncQuery } from '../util/async-query';
import { CompletionStrategy } from '../models/completion-strategy';


export class CollectionService {

   constructor(
      private readonly db: Pool
   ) { }

   create = async (name: string, startingYear: number, ownerId: number): Promise<any> => {
      const config = await asyncQuery(
         this.db,
         `INSERT INTO configuration (join_allowed, completion_strategy) ` +
         `VALUES ?`,
         [
            [
               [
                  false,
                  CompletionStrategy.Random
               ]
            ]
         ]
      );

      return (await asyncQuery(
         this.db,
         `INSERT INTO group_collection (name, starting_year, owner_id, config_id) ` +
         `VALUES ?`,
         [
            [
               [
               name,
               startingYear,
               ownerId,
               config.insertId,
            ]
         ]
      ]
      )).insertId;
   }

   getAll = async (ownerId: number): Promise<any> => {
      return await asyncQuery(
         this.db,
         `SELECT * FROM group_collection WHERE owner_id = ?`,
         [
            ownerId
         ]
      )
   }

}