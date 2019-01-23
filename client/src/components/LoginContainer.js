import React from 'react';
import styled from 'styled-components';
import { Route, NavLink } from 'react-router-dom';
import RegisterLogin from './Register';
import Users from './Users';

const LoginWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  min-height: 400px;
  border: 3px solid ${props => props.theme.gray};
  border-radius: 8px;
  background-color: ${props => props.theme.dBlue}
  margin: 40px auto;
  color: ${props => props.theme.red}
  box-shadow: 4px 4px 22px ${props => props.theme.lBlue}
`;

const LoginNav = styled.nav`
  width: 100%;
  height: 50px;
  background-color: ${props => props.theme.red}
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: black;

  a {
    text-decoration: none;
    font-size: 20px;
    color: ${props => props.theme.gray};
    opacity: .7;

  }

  .active {
    font-weight: bold;
    opacity: 1;
  }
`;

class LoginContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };
  }

  logInUser = token => {
    this.setState({ loggedIn: true });
    localStorage.setItem('jwt', token);
  };

  logOutUser = () => {
    this.setState({ loggedIn: false });
    localStorage.removeItem('jwt');
  };

  render() {
    return (
      <LoginWrapper>
        <LoginNav>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink exact to="/users">Users</NavLink>
          <NavLink to="/users/department">Department</NavLink>
          {this.state.loggedIn && <h3 onClick={this.logOutUser}>Logout</h3>}
        </LoginNav>
        <Route
          path="/login"
          render={props => (
            <RegisterLogin {...props} login logInUser={this.logInUser} />
          )}
        />
        <Route
          path="/register"
          render={props => <RegisterLogin {...props} />}
        />
        <Route path="/users" exact render={props => <Users {...props} />} />
                        <Route path="/users/department" render={props => <Users {...props} department />} />
      </LoginWrapper>
    );
  }
}

export default LoginContainer;
