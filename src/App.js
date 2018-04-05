import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import {
  Container,
} from 'reactstrap';

import TopicCreate from './topics/Create';
import TopicsList from './topics/List';
import TopicSingle from './topics/Single';
import Header from './layout/Header';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Header />
          <br />
          <Container className='MainContainer'>
            <Switch>
              <Route exact path='/' component={TopicsList} />
              <Route exact path='/topics/' component={TopicsList} />
              <Route exact path='/topics/create' component={TopicCreate} />
              <Route exact path='/topics/:topicId/' component={TopicSingle} />
              <Route component={() => '404! No Route found'} />
            </Switch>
          </Container>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;