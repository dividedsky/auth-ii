import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const UserList = styled.div`
  position: relative;
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

class Users extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      errorMessage: '',
    }
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:4200/users', {headers: { Authorization: localStorage.getItem('jwt') }}
    )
      .then(res => {
        this.setState({users: res.data});
      })
      .catch(err => {
        this.setState({ errorMessage: err.message })
        
      })
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <h3>{this.state.errorMessage}</h3>
      )
    }
    return (
      <>
        <h2>User List</h2>
        <UserList>
          {this.state.users.length && this.state.users.map((u, i) => <p key={i}>{u.username}</p>)}
        </UserList>
      </>
    )
  }
}

export default Users;
