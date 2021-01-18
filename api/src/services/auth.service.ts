import { Pool } from 'promise-mysql';

export class AuthService {

   constructor(
      private readonly db: Pool
   ) { }

   register = async (email: string, password: string): Promise<any> => {
      return await this.db.query(
         'INSERT INTO user_account (email, password_hash) VALUES (?, ?)',
         [
            email,
            password
         ]
      );
   }

   login = async (email: string, password: string): Promise<any> => {;
      return await this.db.query(
         'SELECT id, email, role FROM user_account WHERE email = ? AND password_hash = ?',
         [
            email,
            password
         ]
      );
   }


}