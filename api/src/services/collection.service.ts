import { Pool } from 'mysql';
import { asyncQuery } from '../util/async-query';
import { v4 as uuid } from 'uuid';
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

}