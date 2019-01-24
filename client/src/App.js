import React, {Component} from 'react';
import './App.css';
import Login from './components/LoginContainer';
import Users from './components/Users';
import {ThemeProvider} from 'styled-components';
import {Route} from 'react-router-dom';

const theme = {
  red: '#c82121',
  gray: '#dee1ec',
  lBlue: '#becbff',
  dBlue: '#0d0cb5',
}

class App extends Component {
  render() {
    return (
      <>
      <ThemeProvider theme={theme}>
      <div className="App">
              <Route path="/" component={Login} />
      </div>
  </ThemeProvider>
      </>
    );
  }
}

export default App;
