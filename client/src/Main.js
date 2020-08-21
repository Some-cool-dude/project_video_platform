import React from 'react'
import Home from './Home';
import About from './About';
import Videos from './Videos';
import Video from './Video';
import NewVideo from './NewVideo';
import NewChannel from './NewChannel';
import Channels from './Channels';
import Channel from './Channel';
import Users from './Users';
import User from './User';
import Auhorize from './Authorize';
import Forbidden from './Forbidden';
import Header from "./Header";
import Footer from "./Footer";
import API from './API';
import Login from "./Login";
import Register from "./Register";
import PageNotFound from './PageNotFound';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { EventEmitter } from 'events';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: localStorage.getItem('jwt'),
            id: null
        }
        this.handler = this.handler.bind(this);
        this.eventEmitter = new EventEmitter();
    }

    handler(auth) {
        this.setState({auth: auth})
    }

    componentDidMount() {
        this.eventEmitter.addListener("auth", this.handler);
    }

    componentWillUnmount() {
        this.eventEmitter.removeListener("auth", this.handler);
    }

  render() {
    return (
        <Router>
            <Header key={this.state.auth} eventEmitter={this.eventEmitter} auth={this.state.auth}/>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/videos/new" render={(props) => <NewVideo auth={this.state.auth} {...props} />} />
            <Route path="/videos/:id" render={(props) => <Video auth={this.state.auth} {...props} />} />
            <Route path="/videos" component={Videos} />
            <Route path="/channels/new" render={(props) => <NewChannel auth={this.state.auth} {...props} />} />
            <Route path="/channels/:id" render={(props) => <Channel auth={this.state.auth} {...props} />} />
            <Route path="/channels" component={Channels} />
            <Route path="/profile" render={(props) => <User auth={this.state.auth} {...props} />} />
            <Route path="/users/:id" render={(props) => <User auth={this.state.auth} {...props} />} />
            <Route path="/users" render={(props) => <Users auth={this.state.auth} {...props} />} />
            <Route path="/login" render={(props) => <Login eventEmitter={this.eventEmitter} {...props} />} />
            <Route path="/register" component={(props) => <Register eventEmitter={this.eventEmitter}{...props} />} />
            <Route path="/developer" component={API} />
            <Route path="/401" component={Auhorize} />
            <Route path='/403' component={Forbidden} />
            <Route path="*" component={PageNotFound} />
          </Switch>
             <Footer />
      </Router>
    );
  }
}

export default Main