import { CollectionService } from './collection.service';
import { Pool } from 'promise-mysql';
import { InstanceManager } from '../util/instance-manager';
import { WebsocketService } from './websocket.service';


export class RealTimeService {

   private readonly websocketService: WebsocketService;
   private readonly collectionService: CollectionService;

   constructor(
      private readonly db: Pool
   ) {
      this.websocketService = InstanceManager.get(WebsocketService);
      this.collectionService =  InstanceManager.get(CollectionService);
   }

   updateSubscribers = async () => {
      const result = await this.collectionService.getData();
     
      // push updates for each collection publisher
      Object.keys(result).forEach(collectionId => {
         this.websocketService.pushUpdates(parseInt(collectionId), result[collectionId]);
      })
   }

}