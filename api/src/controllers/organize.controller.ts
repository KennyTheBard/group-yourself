import { Request, Response, Router } from 'express';
import { AuthService } from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { StudentService } from '../services/student.service';
import { CollectionService } from '../services/collection.service';
import { authorizeAndExtractToken } from '../security/jwt';
import { InstanceManager } from '../util/instance-manager';
import { GroupService } from '../services/group.service';
import { ConfigService } from '../services/config.service';


export class OrganizeController {

   public path = '/org';
   public router = Router();

   private studentService: StudentService;
   private collectionService: CollectionService;
   private groupService: GroupService;
   private configService: ConfigService;

   constructor(
   ) {
      this.studentService = InstanceManager.get(StudentService);
      this.collectionService = InstanceManager.get(CollectionService);
      this.groupService = InstanceManager.get(GroupService);
      this.configService = InstanceManager.get(ConfigService);

      this.router.use(authorizeAndExtractToken);

      this.router.post(`${this.path}/collection`, this.createCollection);
      this.router.get(`${this.path}/collection`, this.getCollections);
      this.router.put(`${this.path}/config`, this.updateCollectionConfig);
      this.router.get(`${this.path}/config/:collectionId`, this.getCollectionConfig);
      this.router.post(`${this.path}/student`, this.enroll);
      this.router.get(`${this.path}/student/:collectionId`, this.getStudents);
      this.router.post(`${this.path}/group`, this.addGroup);
      this.router.get(`${this.path}/group/:collectionId`, this.getGroups);
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
         res.status(400).send(err.message);
      }
   }

   /**
    * GET /org/collection
    */
   getCollections = async (req: Request, res: Response) => {
      try {
         res.status(StatusCodes.OK)
            .send(await this.collectionService.getAll(req.user.id));
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

   /**
    * PUT /org/config
    */
   updateCollectionConfig = async (req: Request, res: Response) => {
      try {
         await this.configService.update(
            req.body.collectionId,
            req.body.joinAllowed,
            req.body.strategy
         );

         res.status(StatusCodes.OK)
            .send();
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

   /**
    * GET /org/config/:collectionId
    */
   getCollectionConfig = async (req: Request, res: Response) => {
      try {
         const result = await this.configService.getByCollectionId(
            parseInt(req.params['collectionId'])
         );

         res.status(StatusCodes.OK).send(result);
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

   /**
    * POST /org/student
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
         res.status(400).send(err.message);
      }
   }

   /**
    * GET /org/student/:collectionId
    */
   getStudents = async (req: Request, res: Response) => {
      try {
         const result = await this.studentService.getStudentsForCollection(
            parseInt(req.params['collectionId'])
         );

         res.status(StatusCodes.OK).send(result);
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

   /**
    * POST /org/group
    */
   addGroup = async (req: Request, res: Response) => {
      try {
         const collectionId = await this.groupService.create(req.body.collectionId, req.body.name, req.body.maxSeats);

         res.status(StatusCodes.CREATED).send({
            collectionId
         });
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

   /**
    * GET /org/group/:collectionId
    */
   getGroups = async (req: Request, res: Response) => {
      try {
         const result = await this.groupService.getGroupsForCollection(parseInt(req.params['collectionId']));

         res.status(StatusCodes.OK).send(result);
      } catch (err) {
         res.status(400).send(err.message);
      }
   }

}