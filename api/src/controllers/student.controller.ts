import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StudentService } from '../services/student.service';
import { authorizeAndExtractStudentToken } from '../security/jwt';
import { InstanceManager } from '../util/instance-manager';
import { StudentAccount } from '../models/student-account';
import { CollectionService } from '../services/collection.service';


export class StudentController {

   public path = '/stud';
   public router = Router();

   private studentService: StudentService;
   private collectionService: CollectionService;

   constructor(
   ) {
      this.studentService = InstanceManager.get(StudentService);
      this.collectionService = InstanceManager.get(CollectionService);

      this.router.use(authorizeAndExtractStudentToken);

      this.router.post('/enroll', this.enroll);
      this.router.get('/collection/data/:collectionId', this.getCollectionData);
   }

   /**
    * POST /stud/enroll
    */
   enroll = async (req: Request, res: Response) => {
      try {
         await this.studentService.enrollInGroup(
            req.user.id,
            (req.user as StudentAccount).uuidCode,
            req.body.groupId
         );

         res.status(StatusCodes.OK).send();
      } catch (err) {
         res.status(400).send(err.message);
      }
   }


   /**
    * GET /stud/collection/data/:collectionId
    */
   getCollectionData = async (req: Request, res: Response) => {
      try {
         const collectionId = req.params['collectionId'] ? parseInt(req.params['collectionId']) : undefined;
         const result = await this.collectionService.getData(collectionId);

         res.status(StatusCodes.OK).send(result);
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

}