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
      sendingEmails: false,
      data: {} as CollectionData,
      createNewGroup: false,
      newGroup: {
         name: '',
         maxSeats: 0
      },
      addNewStudents: false,
      newStudent: {
         fullname: '',
         email: ''
      }
   };

   constructor(props: OrganizerSettingProps) {
      super(props);

      this.state.collectionId = parseInt(props.match.params.collectionId);
   }

   componentDidMount() {
      if (!localStorage.getItem('token')) {
         this.props.history.push('/')
      }

      this.loadData();
   }

   loadData() {
      axios.get(`${config.SERVER_URL}/org/collection/data/${this.state.collectionId}`, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         }
      }).then((res: { data: string }) => {
         this.setState({
            data: res.data
         });
      }).catch((error: AxiosError) => {
         this.props.alert('error', error.response.data);
      });
   }

   toggleJoinAllowedForCollection(collectionId: number, active: boolean) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         axios.put(`${config.SERVER_URL}/org/config`, {
            collectionId,
            joinAllowed: active,
            strategy: 'RANDOM'
         }, {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         })
            .then((res) => {
               if (active) {
                  this.props.alert('success', 'Successfully activated auto-enrollment!');
               } else {
                  this.props.alert('success', 'Successfully deactivated auto-enrollment!');
               }
               this.loadData();
            }).catch((error: AxiosError) => {
               this.props.alert('error', error.response.data);
            });
      };
   }

   sendEmails = (e: React.MouseEvent<HTMLButtonElement>) => {
      axios.post(`${config.SERVER_URL}/org/notify/${this.state.collectionId}`,
         {}, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         }
      })
         .then((res) => {
            this.props.alert('success', 'Students have been notified, don\'t forget to enable auto-enrollment!');
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response.data);
         });
   };

   onChangeNewGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newGroup: {
            name: e.target.value,
            maxSeats: this.state.newGroup.maxSeats
         }
      })
   }

   onChangeNewGroupMaxSeats = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newGroup: {
            name: this.state.newGroup.name,
            maxSeats: e.target.value
         }
      })
   }

   onSubmitGroup = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      axios.post(`${config.SERVER_URL}/org/group`, {
         collectionId: this.state.collectionId,
         name: this.state.newGroup.name,
         maxSeats: this.state.newGroup.maxSeats
      }, {
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
         }
      }).then((res) => {
         this.props.alert('success', 'Successfully created new group!');
         this.setState({
            createNewGroup: false,
            newGroup: {
               name: '',
               maxSeats: 0
            }
         });
         this.loadData();
      }).catch((error: AxiosError) => {
         this.props.alert('error', error.response.data || 'Creation failed');
      });
   }

   onChangeNewStudentFullname = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newStudent: {
            fullname: e.target.value,
            email: this.state.newStudent.email
         }
      })
   }

   onChangeNewStudentEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newStudent: {
            fullname: this.state.newStudent.fullname,
            email: e.target.value
         }
      })
   }

   onSubmitStudent = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      axios.post(`${config.SERVER_URL}/org/student`,
         {
            collectionId: this.state.collectionId,
            fullname: this.state.newStudent.fullname,
            email: this.state.newStudent.email
         },
         {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         })
         .then((res) => {
            this.props.alert('success', 'Successfully added student!');
            this.setState({
               assNewStudent: false,
               newStudent: {
                  fullname: '',
                  email: ''
               }
            });
            this.loadData();
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response.data || 'Creation failed');
         });
   }

   render() {
      return (
         <div>
            <div>
               {/* Send emails to all students */}
               {
                  <div>
                     <button
                        disabled={this.state.sendingEmails}
                        onClick={this.sendEmails}>
                        Notify students through email
                     </button>
                  </div>
               }
               {/* Create new group button */}
               {this.state.createNewGroup ?
                  (<button onClick={() => {
                     this.setState({ createNewGroup: false })
                  }}>
                     Cancel
                  </button>) :
                  (<button onClick={() => {
                     this.setState({ createNewGroup: true })
                  }}>
                     Create new group
                  </button>)
               }

               {/* Create new group form */}
               {this.state.createNewGroup &&
                  (<div className='form-container'>
                     <fieldset>
                        <legend>Create new group</legend>

                        <form onSubmit={this.onSubmitGroup}>
                           <div className='form-group'>
                              <label>Name</label>
                              <input
                                 type='text'
                                 value={this.state.newGroup.name}
                                 onChange={this.onChangeNewGroupName}
                                 className='form-control' />
                           </div>
                           <div className='form-group'>
                              <label>Max seats</label>
                              <input
                                 type='number'
                                 value={this.state.newGroup.maxSeats}
                                 onChange={this.onChangeNewGroupMaxSeats}
                                 className='form-control' />
                           </div>
                           <div className='form-group'>
                              <input type='submit' value='Create' className='btn btn-submit' />
                           </div>
                        </form>
                     </fieldset>
                  </div>)
               }
            </div>

            <div>
               {/* Add new student */}
               {this.state.addNewStudents ?
                  (<button onClick={() => {
                     this.setState({ addNewStudents: false })
                  }}>
                     Cancel
                  </button>) :
                  (<button onClick={() => {
                     this.setState({ addNewStudents: true })
                  }}>
                     Add new student
                  </button>)
               }

               {/* Add new student form */}
               {this.state.addNewStudents &&
                  (<div className='form-container'>
                     <fieldset>
                        <legend>Create new student</legend>

                        <form onSubmit={this.onSubmitStudent}>
                           <div className='form-group'>
                              <label>Name</label>
                              <input
                                 type='text'
                                 value={this.state.newStudent.fullname}
                                 onChange={this.onChangeNewStudentFullname}
                                 className='form-control' />
                           </div>
                           <div className='form-group'>
                              <label>Email</label>
                              <input
                                 type='text'
                                 value={this.state.newStudent.email}
                                 onChange={this.onChangeNewStudentEmail}
                                 className='form-control' />
                           </div>
                           <div className='form-group'>
                              <input type='submit' value='Create' className='btn btn-submit' />
                           </div>
                        </form>
                     </fieldset>
                  </div>)
               }
            </div>

            <div>
               {/* Groups list */}
               {this.state.data && this.state.data.groups && this.state.data.groups.map((g) => {
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
                     </div>
                  );
               })}
               {this.state.data &&
                  <button
                     onClick={this.toggleJoinAllowedForCollection(this.state.collectionId, !this.state.data.joinAllowed)}>
                     {!this.state.data.joinAllowed ?
                        'Enable auto-enrollment' :
                        'Disable auto-enrollment'}
                  </button>
               }
               {this.state.data && this.state.data.unseatedStudents &&
                  <p>Students remaining: <b>{this.state.data.unseatedStudents.length}</b></p>
               }
            </div>
         </div>)
   }
}