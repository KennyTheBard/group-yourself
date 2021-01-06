import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { StudentService } from '../services/student.service';
import { CollectionService } from '../services/collection.service';
import { authorizeAndExtractToken } from '../security/jwt';
import { InstanceManager } from '../util/instance-manager';


export class OrganizeController {

   public path = '/org';
   public router = Router();

   private studentService: StudentService;
   private collectionService: CollectionService;

   constructor(
   ) {
      this.studentService = InstanceManager.get(StudentService);
      this.collectionService = InstanceManager.get(CollectionService);

      this.router.use(authorizeAndExtractToken);

      this.router.post(`${this.path}/collection`, this.createCollection);
      this.router.post(`${this.path}/enroll`, this.enroll);
      this.router.get(`${this.path}/students/:collectionId`, this.getStudents);
   }

   /**
    * POST /org/collection
    */
   createCollection = async (req: Request, res: Response) => {
      try {
         const collectionId = await this.collectionService.create(req.body.name, req.body.startingYear, req.user.id);

         res.status(StatusCodes.CREATED).send({
            collectionId
         });
      } catch (err) {
         if (err.message.includes('ER_DUP_ENTRY')) {
            res.status(400).send('There is already an account registered on this email address');
         } else {
            res.status(400).send(err.message);
         }
      }
   }

   /**
    * POST /org/enroll
    */
   enroll = async (req: Request, res: Response) => {
      try {
         if (req.body.students) {
            await this.studentService.enrollStudents(req.body.collectionId, req.body.students);
         } else {
            await this.studentService.enrollStudent(req.body.collectionId, req.body.email, req.body.fullname);
         }

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
    * GET /org/students/:collectionId
    */
   getStudents = async (req: Request, res: Response) => {
      try {
         const result = await this.studentService.getStudentsForCollection(parseInt(req.params['collectionId']));

         res.status(StatusCodes.OK).send(result);
      } catch (err) {
         if (err.message.includes('ER_DUP_ENTRY')) {
            res.status(400).send('There is already an account registered on this email address');
         } else {
            res.status(400).send(err.message);
         }
      }
   }


}