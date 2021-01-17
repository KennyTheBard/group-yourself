import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component';
import config from '../utils/config';

export interface RegisterProps extends RouteComponentProps {
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

export default class RegisterComponent extends React.Component<RegisterProps, any> {
   state = {
      username: '',
      email: '',
      password: '',
      repassword: ''
   }

   componentDidMount() {
      if (!!localStorage.getItem('token')) {
         this.props.history.push('/')
      }
   }

   onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ username: e.target.value })
   }

   onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ email: e.target.value })
   }

   onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ password: e.target.value })
   }

   onChangeRepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ repassword: e.target.value })
   }

   onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (this.state.password !== this.state.repassword) {
         this.props.alert('error', 'Passwords don\'t match!');
         return;
      }

      axios.post(config.SERVER_URL + '/auth/register', {
         username: this.state.username,
         email: this.state.email,
         password: this.state.password,
         repassword: this.state.repassword
      })
         .then(() => {
            this.props.alert('success', 'You have been registered!');
            this.props.history.push('/login');
         }).catch((error) => {
            this.props.alert('error', error.response.data || 'Registration failed');
         });
   }

   render() {
      return (
         <div className='form-container'>
            <fieldset>
               <legend>Sign in</legend>

               <form onSubmit={this.onSubmit}>
                  <div className='form-group'>
                     <label>Username</label>
                     <input type='text' value={this.state.username} onChange={this.onChangeUsername} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <label>Email</label>
                     <input type='text' value={this.state.email} onChange={this.onChangeEmail} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <label>Password</label>
                     <input type='password' value={this.state.password} onChange={this.onChangePassword} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <label>Retype Password</label>
                     <input type='password' value={this.state.repassword} onChange={this.onChangeRepassword} className='form-control' />
                  </div>
                  <div className='form-group'>
                     <input type='submit' value='Sign in' className='btn btn-submit' />
                  </div>
               </form>
               <Link to='/login'>Already have an account?</Link>
            </fieldset>
         </div>)
   }
}
