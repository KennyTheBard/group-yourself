import { Pool } from 'promise-mysql';
import { CompletionStrategy } from '../models/completion-strategy';


export class ConfigService {

   constructor(
      private readonly db: Pool
   ) { }

   getByCollectionId = async (collectionId: number): Promise<any> => {
      return await this.db.query(
         'SELECT c.join_allowed, c.completion_strategy FROM configuration c ' +
         'JOIN group_collection gc ON gc.config_id = c.id ' +
         'WHERE gc.id = ?',
         [
            collectionId
         ]
      )
   }

   update = async (collectionId: number, joinAllowed: boolean, strategy: CompletionStrategy) => {
      await this.db.query(
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