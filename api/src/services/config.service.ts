import { Pool } from 'mysql';
import { CompletionStrategy } from '../models/completion-strategy';
import { asyncQuery } from '../util/async-query';


export class ConfigService {

   constructor(
      private readonly db: Pool
   ) { }

   getByCollectionId = async (collectionId: number): Promise<any> => {
      return await asyncQuery(
         this.db,
         'SELECT c.join_allowed, c.completion_strategy FROM configuration c ' +
         'JOIN group_collection gc ON gc.config_id = c.id ' +
         'WHERE gc.id = ?',
         [
            collectionId
         ]
      )
   }

   update = async (collectionId: number, joinAllowed: boolean, strategy: CompletionStrategy) => {
      await asyncQuery(
         this.db,
         'UPDATE configuration c JOIN group_collection gc ON gc.config_id = c.id ' +
         'SET c.join_allowed = ?, c.completion_strategy = ? ' +
         'WHERE gc.id = ?',
         [
            joinAllowed,
            strategy,
            collectionId
         ]
      );
   }
}