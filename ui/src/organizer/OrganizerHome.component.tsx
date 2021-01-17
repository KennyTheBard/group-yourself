import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component.js';

export interface OrganizerHomeProps extends RouteComponentProps<{
   collectionId: string,
}> {
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

export default class OrganizerHome extends React.Component<OrganizerHomeProps, any> {

   state = {
      collections: [
         {
            id: 0,
            name: '',
            joinAllowed: true
         }
      ]
   };

   componentDidMount() {
      if (!localStorage.getItem('token')) {
         this.props.history.push('/')
      }
   }

   editCollectionSetting(collectionId: number) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         this.props.history.push(`/organizer/${collectionId}`);
      };
   }

   render() {
      return (
         <div>
            {this.state.collections.map((c) => {
               return (
                  <div>
                     <p>
                        {c.name}
                     </p>
                     <p>
                        {c.joinAllowed ?
                           'Auto-enrollment allowed' :
                           'Auto-enrollment not allowed'
                        }
                     </p>
                     <button
                        onClick={this.editCollectionSetting(c.id)}>
                        Edit
                        </button>
                  </div>
               );
            })}
         </div>)
   }
}