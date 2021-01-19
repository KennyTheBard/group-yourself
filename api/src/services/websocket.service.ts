import expressWs from 'express-ws';
import * as ws from 'ws';
import * as http from 'http';
import * as url from 'url';

interface Subscriber {
   id: number;
   ws: ws;
}

export class WebsocketService {

   private readonly subs: Map<number, Subscriber[]> = new Map<number, Subscriber[]>();

   constructor(
      private readonly router: expressWs.Router,
   ) {
      this.router.ws('/socket', (ws: ws, req: http.IncomingMessage) => {
         console.log(`New connection`);

         const query = url.parse(req.url, true).query;
         const groupCollectionId = parseInt(query.groupCollectionId as string);
         const studentId = parseInt(query.studentId as string);

         if (!this.subs.has(groupCollectionId)) {
            this.subs.set(groupCollectionId, []);
         }
         this.subs.get(groupCollectionId).push({
            id: studentId,
            ws
         });

         ws.on('close', () => {
            console.log(`Connection closed`);
            this.subs.set(
               groupCollectionId,
               this.subs.get(groupCollectionId).filter((s: Subscriber) => s.id != studentId)
            )
         });
      });
   }

   pushUpdates = async (collectionId: number, updateData: any) => {
      if (!this.subs.get(collectionId)) {
         return; 
      }
      
      this.subs.get(collectionId).forEach((s: Subscriber) =>
         s.ws.send(
            JSON.stringify(updateData),
            (err) => err ? console.log(err) : console.log('update sent')
         )
      );
   }

}