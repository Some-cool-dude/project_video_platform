import React from "react";
import axios from "axios";
import { NavLink, withRouter } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      auth: this.props.auth
    }
    this.handleClick = this.handleClick.bind(this);
  }

componentDidMount() {
  if (this.state.auth && !this.state.data) {
    const jwt = localStorage.getItem('jwt');
    axios.get("/api/v1/me", {headers: {Authorization: `Bearer ${jwt}`}})
    .then(res => {
      this.setState({data: res.data});
    })
    .catch(console.error);
  }
}

handleClick(event) {
  event.preventDefault();
  localStorage.removeItem('jwt');
  this.setState({data: null});
  this.props.eventEmitter.emit("auth", null);
  this.props.history.push('/');
}

  render() {
    return (
      <nav id="nav">
        <NavLink activeClassName="active" to="/about">About
        </NavLink>
        <NavLink activeClassName="active" to="/videos">Videos
        </NavLink>
        <NavLink activeClassName="active" to="/channels">Channels
        </NavLink>
        <NavLink exact activeClassName="active" to="/">Home
        </NavLink>
        {this.state.auth && this.state.data  ? (
           <span>
             {this.state.data.role &&
                <NavLink activeClassName="active" to="/users">Users
                </NavLink>
             }
           <NavLink activeClassName="active" onClick={this.handleClick} to="/logout">Logout
              </NavLink>
              <div className="user">
                <img src={this.state.data.avaUrl} alt="User" />
                <NavLink activeClassName="active" to="/profile">{this.state.data.login}
                </NavLink>
              </div>
         </span>
        ) : (
          <span>
            <NavLink activeClassName="active" to="/login">Login
              </NavLink>
              <NavLink activeClassName="active" to="/register">Signin
              </NavLink>
          </span>
        )}
        <img src="https://res.cloudinary.com/hlrzutjus/image/upload/v1576349810/logo_anwozf.png" alt="Logo"></img>
        <i>AndrewsBestsite</i>
      </nav>
    );
  }
}
export default withRouter(Header);