import { Pool } from 'promise-mysql';
import { InstanceManager } from '../util/instance-manager';
import { WebsocketService } from './websocket.service';


export class RealTimeService {

   private readonly websocketService: WebsocketService;

   constructor(
      private readonly db: Pool
   ) {
      this.websocketService = InstanceManager.get(WebsocketService);
   }

   updateSubscribers = async () => {
      const rawResult = await this.db.query(
         'SELECT s.full_name AS studentName, s.email AS studentEmail, ' +
         'gc.id AS collectionId, g.id AS groupId, g.name AS groupName, ' +
         'g.max_seats as maxSeats, g.occupied_seats AS occupiedSeats, ' +
         'gc.join_allowed AS joinAllowed FROM student s ' +
         'JOIN group_collection gc ON s.group_collection_id = gc.id ' +
         'JOIN stud_group g ON s.group_id = g.id ' +
         'ORDER BY gc.id, g.id, s.full_name'
      );

      const result = {};
      for (const row of rawResult) {
         // add collection object in the result
         if (Object.keys(result).filter(k => k == row.collectionId).length === 0) {
            result[row.collectionId] = {
               unseatedStudents: [],
               joinAllowed: !!row.joinAllowed,
               groups: []
            }
         }

         // organize students by group
         const collection = result[row.collectionId];
         if (row.groupId) {
            if (collection.groups.filter(g => g.id === row.groupId).length === 0) {
               collection.groups.push({
                  id: row.groupId,
                  name: row.groupName,
                  maxSeats: row.maxSeats,
                  occupiedSeats: row.occupiedSeats,
                  students: []
               });
            }
            
            collection.groups.filter(g => g.id === row.groupId)[0].students.push({
               name: row.studentName,
               email: row.studentEmail
            });
         } else {
            collection.unseatedStudents.push({
               name: row.studentName,
               email: row.studentEmail
            });
         }
      };

      // push updates for each collection publisher
      Object.keys(result).forEach(collectionId => {
         this.websocketService.pushUpdates(parseInt(collectionId), result[collectionId]);
      })
   }

}