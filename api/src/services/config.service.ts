import { Pool } from 'promise-mysql';
import { CompletionStrategy } from '../models/completion-strategy';


export class ConfigService {

   constructor(
      private readonly db: Pool
   ) { }

   getById = async (collectionId: number): Promise<any> => {
      return await this.db.query(
         'SELECT join_allowed, completion_strategy FROM group_collection ' +
         'WHERE id = ?',
         [
            collectionId
         ]
      )
   }

   update = async (collectionId: number, ownerId: number, joinAllowed: boolean, strategy: CompletionStrategy) => {
      const group = await this.db.query(
         'SELECT * FROM group_collection WHERE id = ?',
         [
            collectionId,
         ]
      );
      
      if (group.lenght === 0) {
         throw new Error('Group collection not found!')
      }

      if (group[0].owner_id !== ownerId) {
         throw new Error('Unauthorized access!')
      }
      
      await this.db.query(
         'UPDATE group_collection ' +
         'SET join_allowed = ?, completion_strategy = ? ' +
         'WHERE id = ? AND owner_id = ?',
         [
            joinAllowed,
            strategy,
            collectionId,
            ownerId
         ]
      );
   }
}