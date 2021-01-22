import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component';
import axios from 'axios';
import { AxiosError } from '../utils/axios-error';
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
   }

   loadData() {
      axios.get(`${config.SERVER_URL}/stud/collection/data/${this.state.collectionId}`, {
         headers: {
            'Authorization-Student': `${this.state.studentId}:${this.state.studentCode}`
         }
      })
         .then((res) => {
            this.setState({
               data: res.data
            });
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response?.data || 'Failed to establish connection to server');
         });
   }

   componentDidMount() {
      const ws = new WebSocket(`${config.SOCKET_URL}/?` +
         `groupCollectionId=${this.state.collectionId}&studentId=${this.state.studentId}`);

      const that = this;
      ws.onmessage = (event: MessageEvent) => {
         that.setState({ data: JSON.parse(event.data) })
      }

      ws.onopen = () => {
         console.log('connected')
      }

      ws.onclose = () => {
         console.log('disconnected')
      }

      this.loadData();
   }

   joinGroup(groupId: number) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         axios.post(config.SERVER_URL + '/stud/enroll', {
            groupId
         }, {
            headers: {
               'Authorization-Student': `${this.state.studentId}:${this.state.studentCode}`
            }
         })
            .then((res) => {
               this.props.alert('success', 'Successfully joined new group!');
               this.loadData();
            }).catch((error: AxiosError) => {
               this.props.alert('error', error.response?.data || 'Failed to establish connection to server');
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