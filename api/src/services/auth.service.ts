import { Pool } from 'mysql';
import q from 'q';

export class AuthService {

   constructor(
      private readonly db: Pool
   ) { }

   register = async (email: string, password: string): Promise<any> => {
      const deferred = q.defer<any>();

      this.db.query(
         'INSERT INTO user_account SET ?',
         {
            email,
            password_hash: password
         },
         (err, results, _fields) => {
            if (err) {
               deferred.reject(err);
            } else {
               deferred.resolve(results);
            }
         }
      )

      return deferred.promise;
   }

}