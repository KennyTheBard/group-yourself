import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component';
import axios from 'axios';
import { AxiosError } from '../utils/axios-error';
import config from '../utils/config';


export interface OrganizerSettingProps extends RouteComponentProps<{
   collectionId: string,
}> {
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

interface Student {
   name: string;
   email: string;
}

interface Group {
   id: number;
   name: string;
   maxSeats: number;
   occupiedSeats: number;
   students: Student[];
}

interface CollectionData {
   unseatedStudents: string[];
   joinAllowed: boolean;
   groups: Group[];
}

export default class OrganizerSetting extends React.Component<OrganizerSettingProps, any> {

   state = {
      collectionId: 0,
      studentId: 0,
      studentCode: '',
      data: {} as CollectionData
   };

   constructor(props: OrganizerSettingProps) {
      super(props);

      this.state.collectionId = parseInt(props.match.params.collectionId);

      const query = new URLSearchParams(this.props.location.search);
      this.state.studentId = parseInt(query.get('id') || '0');
      this.state.studentCode = query.get('code') || '';
   }

   componentDidMount() {
      if (!localStorage.getItem('token')) {
         this.props.history.push('/')
      }

      const ws = new WebSocket(`${config.SOCKET_URL}?` +
         `groupCollectionId=${this.state.collectionId}&studentId=${this.state.studentId}`);


      ws.onopen = () => {
         console.log('connected');
      }

      const that = this;
      ws.onmessage = (event) => {
         console.log(event.data);
         that.setState({ data: event.data });
      };

      ws.onclose = () => {
         console.log('disconnected');

      }
   }

   toggleJoinAllowedForGroup(collectionId: number, active: boolean) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         axios.put(`${config.SERVER_URL}/org/config`, {
            collectionId,
            joinAllowed: active,
            strategy: 'RANDOM'
         })
            .then((res) => {
               if (active) {
                  this.props.alert('success', 'Successfully activated auto-enrollment!');
               } else {
                  this.props.alert('success', 'Successfully deactivated auto-enrollment!');
               }
            }).catch((error: AxiosError) => {
               this.props.alert('error', error.response.data);
            });
      };
   }

   render() {
      return (
         <div>
            <div>
               {this.state.data.groups && this.state.data.groups.map((g) => {
                  return (
                     <div>
                        <p>
                           {g.name} ({g.occupiedSeats}/{g.maxSeats})
                        </p>
                        <ul>
                           {g.students.map((s) => {
                              return (
                                 <li>
                                    {s.name} ({s.email})
                                 </li>
                              );
                           })}
                        </ul>
                        <button
                           onClick={this.toggleJoinAllowedForGroup(g.id, !this.state.data.joinAllowed)}>
                           {!this.state.data.joinAllowed ?
                              'Allow auto-enrollment' :
                              'Disallow auto-enrollment'}
                        </button>
                     </div>
                  );
               })}
            </div>
            <p>Students remaining:{this.state.data.unseatedStudents}</p>
         </div>)
   }
}