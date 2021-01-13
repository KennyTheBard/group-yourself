import expressWs from 'express-ws';
import * as ws from 'ws';

interface Subscriber {
   id: number;
   ws: ws;
}

export class WebsocketService {

   private readonly subs: Map<number, Subscriber[]> = new Map<number, Subscriber[]>();

   constructor(
      private readonly router: expressWs.Router,
   ) {
      router.ws('/socket', (ws: ws, req) => {
         const groupCollectionId = parseInt(req.query['groupCollectionId'] as string);
         const studentId = parseInt(req.query['studentId'] as string);

         if (!this.subs.has(groupCollectionId)) {
            this.subs.set(groupCollectionId, []);
         }
         this.subs.get(groupCollectionId).push({
            id: studentId,
            ws
         });

         ws.on('close', () => {
            this.subs.set(
               groupCollectionId,
               this.subs.get(groupCollectionId).filter((s: Subscriber) => s.id != studentId)
            )
         });
      });
   }

   pushUpdates = async (collectionId: number, updateData: any) => {
      this.subs.get(collectionId).forEach((s: Subscriber) => s.ws.send(JSON.stringify(updateData)));
   }

}