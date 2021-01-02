import { Pool } from 'mysql';
import q from 'q';
import { CreateUser } from '../models/create/create-user';

export class AuthService {

   constructor(
      private readonly db: Pool
   ) { }

   register = async (user: CreateUser): Promise<any> => {
      const deferred = q.defer<any>();

      this.db.query(
         'INSERT INTO user_account SET ?',
         user,
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