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
    const ax = axios.create({
      withCredentials: true,
      headers: {
        authorization: localStorage.getItem('jwt'),
      },
      baseURL: 'http://localhost:4200',
    });
    let url;
    if (this.props.department) {
      url = '/users/department';
    } else {
      url = '/users';
    }

    ax.get(`${url}`)
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.log(err);

        this.setState({
          errorMessage: 'Please log in to access the user list',
        });
        setTimeout(() => {
          this.props.history.push('/login');
        }, 2000);
      });
  }

  render() {
    console.log(this.state.users);

    if (this.state.errorMessage) {
      return <h3>{this.state.errorMessage}</h3>;
    }

    if (!this.state.users.length) return <h1>loading</h1>;
    return (
      <>
        <h2>User List</h2>
        <UserList>
          {this.state.users.length &&
            this.state.users.map((u, i) => (
              <p key={i}>
                <strong>{u.username}:</strong> department of {u.department}
              </p>
            ))}
        </UserList>
      </>
    );
  }
}

export default Users;
