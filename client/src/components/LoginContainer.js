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
  border: 1px solid gray;
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
  render() {
    return (
      <LoginWrapper>
        <LoginNav>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/users">Users</NavLink>
        </LoginNav>
        <Route
          path="/login"
          render={props => <RegisterLogin {...props} login />}
        />
        <Route
          path="/register"
          render={props => <RegisterLogin {...props} />}
        />
        <Route
          path="/users"
          render={props => <Users {...props} />}
        />
      </LoginWrapper>
    );
  }
}

export default LoginContainer;
