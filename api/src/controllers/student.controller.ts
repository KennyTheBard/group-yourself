import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StudentService } from '../services/student.service';
import { authorizeAndExtractStudentToken } from '../security/jwt';
import { InstanceManager } from '../util/instance-manager';
import { StudentAccount } from '../models/student-account';


export class OrganizerController {

   public path = '/stud';
   public router = Router();

   private studentService: StudentService;

   constructor(
   ) {
      this.studentService = InstanceManager.get(StudentService);

      this.router.use(authorizeAndExtractStudentToken);

      this.router.post(`${this.path}/enroll`, this.enroll);
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


}