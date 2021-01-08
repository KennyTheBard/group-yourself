import { StudentAccount } from '../../models/student-account';
import { UserAccount } from '../../models/user-account';

declare module 'express' {
   export interface Request {
     user?: UserAccount | StudentAccount
   }
 }