import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component.js';
import axios from 'axios';
import { AxiosError } from '../utils/axios-error.js';
import config from '../utils/config';

export interface LoginProps extends RouteComponentProps {
   logIn: () => void;
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

export default class LoginComponent extends React.Component<LoginProps, any> {

   state = {
      email: '',
      password: ''
   }

   componentDidMount() {
      if (!!localStorage.getItem('token')) {
         this.props.history.push('/')
      }
   }

   onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ email: e.target.value })
   }

   onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ password: e.target.value })
   }

   onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      axios.post(config.SERVER_URL + '/auth/login', {
         email: this.state.email,
         password: this.state.password
      })
         .then((res: { data: string }) => {
            this.props.alert('success', 'Successful authentication!');
            localStorage.setItem('token', res.data);
            this.props.logIn();
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response.data || 'Authentication failed');
         });
   }

   render() {
      return (
         <div className='form-container'>
            <fieldset>
               <legend>Log in</legend>

               <form onSubmit={this.onSubmit}>
                  <div className='form-group'>
                     <label>Email</label>
                     <input type='text' value={this.state.email} onChange={this.onChangeEmail} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <label>Password</label>
                     <input type='password' value={this.state.password} onChange={this.onChangePassword} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <input type='submit' value='Login' className='btn btn-submit' />
                  </div>
               </form>
               <Link to='/register'>No account?</Link>
            </fieldset>
         </div>)
   }
}