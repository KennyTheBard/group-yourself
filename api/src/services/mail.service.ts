import { Transporter } from 'nodemailer';

export class MailService {

   constructor(
      private readonly smtp: Transporter,
   ) { }

   sendMail = async (destination: string | Array<string>, subject: string, body: string) => {
      await this.smtp.sendMail({
         to: destination,
         subject,
         html: body
      })
   }

}