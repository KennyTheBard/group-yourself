import { BrowserRouter, Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import React from 'react';
import './App.scss';
import { Alert, AlertType, IAlert } from './alert/Alert.component';
import LoginComponent from './public/Login.component';
import RegisterComponent from './public/Register.component';
import StudentComponent from './student/Student.component';
import OrganizerSetting from './organizer/OrganizerSettings.component';
import OrganizerHome from './organizer/OrganizerHome.component';

require('dotenv').config()

export default class App extends React.Component {

  constructor(props: RouteComponentProps) {
    super(props);

    this.addAlert = this.addAlert.bind(this);
  }

  state = {
    loggedIn: !!localStorage.getItem('token'),
    alerts: [] as Array<IAlert>
  };

  addAlert(type: AlertType, message: string) {
    this.setState({
      alerts: [
        ...this.state.alerts,
        {
          message,
          type
        }
      ]
    });
    setTimeout(() => {
      this.setState({ alerts: [...this.state.alerts].slice(1) });
    },
      3000
    );
  }

  logOut = () => {
    localStorage.removeItem("token");
    this.setState({ loggedIn: false });
  }

  logIn = () => {
    this.setState({ loggedIn: true });
  }

  render() {

    return (
      <div className='App'>
        {this.state.alerts.map((d: IAlert) => {
          return <Alert message={d.message} type={d.type} />
        })}

        <BrowserRouter basename='/'>

          <Switch>
            <Route exact path={'/'} render={() =>
              !!localStorage.getItem('token') ?
                (<Redirect to='/' />) :
                (<Redirect to='/login' />)
            } />
            <Route exact path={'/login'} render={(matchProps) =>
              <LoginComponent {...matchProps}
                logIn={this.logIn}
                alert={this.addAlert} />
            } />
            <Route exact path={'/register'} render={(matchProps) =>
              <RegisterComponent {...matchProps}
                alert={this.addAlert} />
            } />
            <Route exact path={'/student/:collectionId'} render={(matchProps) =>
              <StudentComponent {...matchProps}
                alert={this.addAlert} />
            } />
            <Route exact path={'/organizer/home'} render={(matchProps) =>
              <OrganizerHome {...matchProps}
                alert={this.addAlert} />
            } />
            <Route exact path={'/organizer/:collectionId'} render={(matchProps) =>
              <OrganizerSetting {...matchProps}
                alert={this.addAlert} />
            } />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
