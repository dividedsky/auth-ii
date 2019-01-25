import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Nav = styled.nav`
  background-color: black;
  display: flex;
  justify-content: space-around;

  a {
    color: white;
    text-decoration: none;
  }

  .active {
    font-weight: bold;
  }
`;

class Departments extends React.Component {
  state = {
    currentDepartment: null,
    departmentList: [],
    errorMessage: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentDepartment !== this.state.currentDepartment) {
      console.log('change');
    }
  }

  changeDepartment = e => {
    e.preventDefault();
    console.log(e.target.innerText);
    this.setState({ currentDepartment: e.target.innerText }, () => {
      const ax = axios.create({
        withCredentials: true,
        headers: {
          authorization: localStorage.getItem('jwt'),
        },
        baseURL: 'http://localhost:4200/users/department',
      });
      ax.get(`/${this.state.currentDepartment}`)
        .then(res => {
          console.log(res.data);

          this.setState({ errorMessage: '', departmentList: res.data });
        })
        .catch(err => {
          this.setState({
            errorMessage: 'you cannot access that department',
            departmentList: [],
          });
        });
    });
  };

  render() {
    return (
      <div>
        <Nav>
          {this.props.departments.map(d => (
            <p key={d} onClick={this.changeDepartment}>
              {d}
            </p>
          ))}
        </Nav>
        {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}
        <ul>
          {this.state.departmentList.length > 0 &&
            this.state.departmentList.map(i => <li>{i}</li>)}
        </ul>
      </div>
    );
  }
}

export default Departments;
