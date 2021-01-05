import { Pool } from 'mysql';
import { asyncQuery } from '../util/async-query';

export class AuthService {

   constructor(
      private readonly db: Pool
   ) { }

   register = async (email: string, password: string): Promise<any> => {
      return await asyncQuery(
         this.db,
         'INSERT INTO user_account (email, password_hash) VALUES (?, ?)',
         [
            email,
            password
         ]
      );
   }

   login = async (email: string, password: string): Promise<any> => {
      const result = await asyncQuery(
         this.db,
         'SELECT * FROM user_account WHERE email = ? AND password_hash = ?',
         [
            email,
            password
         ]
      );

      console.log(Object.keys(result[0]));
   }


}