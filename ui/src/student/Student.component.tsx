import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component';
import axios from 'axios';
import { AxiosError } from '../utils/axios-error';
import WebSocket from 'ws';
import config from '../utils/config';

export interface StudentProps extends RouteComponentProps<{
   collectionId: string,
}> {
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

export default class StudentComponent extends React.Component<StudentProps, any> {

   state = {
      collectionId: 0,
      studentId: 0,
      studentCode: '',
      data: {
         unseatedStudents: [],
         joinAllowed: false,
         groups: [
            {
               id: 0,
               name: '',
               maxSeats: 0,
               occupiedSeats: 0,
               students: [
                  {
                     name: '',
                     email: ''
                  }
               ]
            }
         ]
      }
   };

   constructor(props: StudentProps) {
      super(props);

      this.state.collectionId = parseInt(props.match.params.collectionId);

      const query = new URLSearchParams(this.props.location.search);
      this.state.studentId = parseInt(query.get('id') || '0');
      this.state.studentCode = query.get('code') || '';

      const ws = new WebSocket(`${config.SOCKET_URL}/socket?` +
         `groupCollectionId=${this.state.collectionId}&studentId=${this.state.studentId}`, {
         perMessageDeflate: false
      });

      const that = this;
      ws.on('message', function incoming(data) {
         console.log(data);
         that.setState({ data })
      });
   }

   componentDidMount() {
      if (!localStorage.getItem('token')) {
         this.props.history.push('/')
      }
   }

   joinGroup(groupId: number) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         axios.post(config.SERVER_URL + '/stud/enroll', {
            groupId
         })
            .then((res: { data: string }) => {
               this.props.alert('success', 'Successfully joined new group!');
            }).catch((error: AxiosError) => {
               this.props.alert('error', error.response.data);
            });
      };
   }

   render() {
      return (
         <div>
            <p>Students remaining:{this.state.data.unseatedStudents.length}</p>
            {!this.state.data.joinAllowed &&
               <p>Auto-enrollment is disabled at the moment</p>
            }
            <div>
               {this.state.data.groups.map((g) => {
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
                           disabled={!this.state.data.joinAllowed}
                           onClick={this.joinGroup(g.id)}>
                           Join
                        </button>
                     </div>
                  );
               })}
            </div>
         </div>)
   }
}