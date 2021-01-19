import { InstanceManager } from '../util/instance-manager';
import { MailService } from './mail.service';
import * as EmailValidator from 'email-validator';

export class NotificationService {

   private readonly mailService: MailService;

   constructor(
   ) {
      this.mailService = InstanceManager.get(MailService);
   }

   notifyStudents = async (collectionId: number, students: Array<any>) => {
      await Promise.all(
         students
            .filter(student => EmailValidator.validate(student.email))
            .map(student => {
               const studentPageUrl = `http://${process.env.WEB_UI_HOST}/student/${collectionId}?id=${student.id}&code=${student.uuid_code}`;
               console.log(studentPageUrl);

               return this.mailService.sendMail(
                  student.email,
                  'You have been invited to enroll yourself in a group',
                  `<p>Click <a href="${studentPageUrl}">here</a> to go to the enrollment page</p>`
               );
            }));
   }

}