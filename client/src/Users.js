import React from 'react';
import axios from 'axios';
import './css/users.css';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        search:'',
        length: 7,
        pages: 0,
        step: 2,
        array: [],
        defaultArray: [],
        isActive: 1,
        data: null
    }
    this.handleWithPrevNext = this.handleWithPrevNext.bind(this);
    this.handleWithClick = this.handleWithClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  update(page, array) {
    axios.get('/api/v1/users?page=' + page + "&search=" + this.state.search, {headers:{Authorization: `Bearer ${this.props.auth}`}})
    .then(res => {
        this.setState({isActive: page, array: array, data: res.data});
    })
    .catch(err => {
      if(err.response) {
        if(err.response.status === 401) return this.props.history.push('/401')
        else if(err.response.status === 403) return this.props.history.push('/403')
        else if(err.response.status === 404) return this.props.history.push('/404')
    }
    console.error(err);
    });
  }

  goToPage(page) {
      let array = [];
      if(page - this.state.step <= 1) {
          array = this.state.defaultArray.concat(["next",this.state.pages]);
      }
      else if(page + this.state.step >= this.state.pages) {
          array = [1, "prev"];
          let pages = this.state.pages;
          for(let i = this.state.length ; i > 2; i--) {
            array[i] = pages;
            pages--;
          }
      }
      else {
          array = [1,"prev",page-1,page,page+1,"next", this.state.pages];
      }
      this.update(page, array);
  }

  handleWithPrevNext(event) {
    if(event.target.id === "next") {
        this.goToPage(this.state.isActive + 2);
    }
    else if(event.target.id === "prev") {
        this.goToPage(this.state.isActive - 2);
    }
    else {
        this.goToPage(parseInt(event.target.id));
    }
  }

  handleWithClick(event) {
      this.update(parseInt(event.target.id), this.state.defaultArray.concat(["next", this.state.pages]));
  }

  handleChange(event) {
    event.persist();
    axios.get('/api/v1/users?search=' + event.target.value, {headers:{Authorization: `Bearer ${this.props.auth}`}})
    .then(res => {
        this.setState({isActive: 1, pages: res.data.pages, array: this.state.defaultArray.concat(["next", res.data.pages]), data: res.data, search: event.target.value});
    })
    .catch(err => {
      if(err.response) {
        if(err.response.status === 401) return this.props.history.push('/401')
        else if(err.response.status === 403) return this.props.history.push('/403')
        else if(err.response.status === 404) return this.props.history.push('/404')
    }
    console.error(err);
    })
  }

  componentDidMount() {
    axios.get('/api/v1/users', {headers:{Authorization: `Bearer ${this.props.auth}`}})
    .then(res => {
      let array = [];
      let count = 1;
        for(let i = 0; i < this.state.length - 2; i++)
        {
          array[i] = count;
          count++;
        }
        this.setState({pages: res.data.pages, array: array.concat(["next", res.data.pages]), defaultArray: array, data: res.data});
    })
    .catch(err => {
      if(err.response) {
        if(err.response.status === 401) return this.props.history.push('/401')
        else if(err.response.status === 403) return this.props.history.push('/403')
        else if(err.response.status === 404) return this.props.history.push('/404')
    }
    console.error(err);
    });
  }

  render() {
    if(!this.state.data) return null;
      const more = this.state.pages > this.state.length;
      let array = [];
      if(!more) {
        for(let i = 0; i < this.state.pages; i++) {
          array[i] = i + 1;
        }
      }
    return (
        <div className="Users">
            <div className="content">
                <input type="text" id="search" placeholder="Search.." onChange={this.handleChange}/>
                <p> Find {this.state.data.search} results</p>
                <h1>Users</h1>
            </div>
                <div>
                  {!this.state.data.items.length 
                    ?(<p>No such videos</p>)
                  :(<table>
                    <tbody>
                      <tr>
                        <th>Login</th>
                        <th>Fullname</th>
                        <th>Registered</th>
                      </tr>
                    {this.state.data.items.map(item =>
                        <tr key={item._id}>
                            <td><a href={"users/" + item._id}>{item.login}</a></td>
                            <td><a href={"users/" + item._id}>{item.fullname}</a></td>
                            <td>{item.registeredAt}</td>
                        </tr>
                    )}
                    </tbody>
                    </table>)
                  }      
                </div>
            <div className="center">
              <div className="pagination">
                {more 
                      ?(<span> {this.state.array.map(page => <button key={page.toString()} id={page.toString()} className={this.state.isActive === page ? 'active' : ''} onClick={this.handleWithPrevNext}>{page}</button>)} </span>)
                      :(<span> {array.map(page => <button key={page.toString()} id={page.toString()} className={this.state.isActive === page ? 'active' : ''} onClick={this.handleWithClick}>{page}</button>)} </span>)
                }
              </div>
            </div>
        </div>
    );

  }

}

export default Users;