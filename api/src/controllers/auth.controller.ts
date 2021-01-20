import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from '../security/jwt';
import { InstanceManager } from '../util/instance-manager';


export class AuthController {

   public path = '/auth';
   public router = Router();

   private authService: AuthService;

   constructor(
   ) {
      this.authService = InstanceManager.get(AuthService);

      this.router.post(`/register`, this.register);
      this.router.post(`/login`, this.login);
   }

   /**
    * POST /auth/register
    */
   register = async (req: Request, res: Response) => {
      try {
         await this.authService.register(req.body.email, req.body.password);
         res.status(StatusCodes.CREATED).send();
      } catch (err) {
         if (err.message.includes('ER_DUP_ENTRY')) {
            res.status(400).send('There is already an account registered on this email address');
         } else {
            res.status(400).send(err.message);
         }
      }
   }

   /**
    * POST /auth/login
    */
   login = async (req: Request, res: Response) => {
      try {
         const result = await this.authService.login(req.body.email, req.body.password);
         if (result.length) {
            res.status(StatusCodes.OK).send(await generateToken(result[0]));
         } else {
            throw new Error('Incorrect credentials');
         }
      } catch (err) {
         res.status(401).send(err.message);
      }
   }

}