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
    };
  }

  componentDidMount() {
    let url;
    if (this.props.department) {
      url = 'http://localhost:4200/users/department'
    } else {
      url = 'http://localhost:4200/users';
    }

    axios.defaults.withCredentials = true;
    axios
      .get(`${url}`, {
        headers: { Authorization: localStorage.getItem('jwt') },
      })
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.log(err);
        
        this.setState({ errorMessage: 'Please log in to access the user list'});
        setTimeout(() => {
          this.props.history.push('/login')
        }
          ,2000);
      })
  }

  render() {
    if (this.state.errorMessage) {
      return <h3>{this.state.errorMessage}</h3>;
    }
    return (
      <>
        <h2>User List</h2>
        <UserList>
          {this.state.users.length &&
              this.state.users.map((u, i) => <p key={i}><strong>{u.username}:</strong> department of {u.department}</p>)}
        </UserList>
      </>
    );
  }
}

export default Users;
