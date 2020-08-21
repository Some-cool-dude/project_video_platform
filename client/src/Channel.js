import React from 'react'
import axios from 'axios';
import './css/video.css'

class Channel extends React.Component {
    owner = ''
  constructor(props) {
    super(props);
    this.state = {
        data: null,
        update: false,
        delete: false,
        subscribe: false
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.Subscribe = this.Subscribe.bind(this);
    this.title = React.createRef()
  }

  handleDelete(e) {
      e.preventDefault();
      axios.delete('/api/v1/channels/' + this.state.data._id, {headers:{Authorization: `Bearer ${this.props.auth}`}})
      .then(this.props.history.push('/channels'))
      .catch(err => {
        if(err.response) {
            if(err.response.status === 401) return this.props.history.push('/401')
            else if(err.response.status === 403) return this.props.history.push('/403')
            else if(err.response.status === 404) return this.props.history.push('/404')
        }
        console.error(err);
      })
  }

  handleUpdate(e) {
      e.preventDefault();
        this.setState({update: false})
      axios.put('/api/v1/channels/' + this.state.data._id,{title: this.title.current.value}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
      .then(res => {
          this.setState({data: res.data});
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

  async componentDidMount() {
    if(!this.state.data) {
        let subscribe = false;
        try {
            let res = await axios.get('/api/v1/me', {headers:{Authorization: `Bearer ${this.props.auth}`}})
            this.owner = res.data._id;
            res = await axios.get('/api/v1/subscribes/' + res.data._id, {headers:{Authorization: `Bearer ${this.props.auth}`}});
            if(res.data) subscribe = true;
            else subscribe = false;
            res = await axios.get('/api/v1/channels/' + this.props.match.params.id);
            this.setState({data: res.data, subscribe: subscribe});
        }
        catch(err) {
            if(err.response) {
                if(err.response.status === 401) return this.props.history.push('/401')
                else if(err.response.status === 403) return this.props.history.push('/403')
                else if(err.response.status === 404) return this.props.history.push('/404')
            }
            console.error(err);
        }
    }
  }

  Subscribe() {
        axios.post('/api/v1/subscribes', {ch_id: this.state.data._id, user_id: this.owner, subscribers: this.state.data.subscribers}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
        .then(res => {
            this.setState({data: res.data, subscribe: true});
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
    const check = this.state.data.owner_id === this.owner;
    return (
        <div className="Video">
            <div className="content">
            <img id="ch" src={this.state.data.chimgUrl} alt="Channel" />
            <h1>{this.state.data.title}</h1>
            <p><b>Created at:</b><i>{this.state.data.createdAt}</i></p>
            <p><b>Subscribers:</b>{this.state.data.subscribers}</p>
            {!this.state.subscribe && <button onClick={this.Subscribe}>Subscribe</button>}
                {this.state.update &&
                <div id="update" className="modal">
                <form className="modal-content animate" onSubmit={this.handleUpdate} action="" method="post">
    
                    <span onClick={() => this.setState({update: false})} className="close" title="Close Modal">&times;</span>
    
                    <div className="container">
                    <label htmlFor="title"><b>Title</b></label>
                    <input type="text" placeholder="Enter title" name="title" defaultValue={this.state.data.title} ref={this.title} maxLength="50" />

                    <button type="submit" className="submit">Update</button>
                    <button type="button" onClick={() => this.setState({update: false})} className="cancelbtn">Cancel</button>
                    </div>
    
                </form>
                </div>
            }
            {this.state.delete &&
                <div id="delete" className="modal">
                <form className="modal-content animate" onSubmit={this.handleDelete} action="" method="post">
    
                    <span onClick={() => this.setState({delete: false})} className="close" title="Close Modal">&times;</span>
                    <div className="container">
                            <img src="../images/alert.png" alt="alert" />
                            <h2>Are you sure you wanna delete this channel?</h2>
                            <button type="submit" className="submit">Delete</button>
                            <button type="button" onClick={() => this.setState({delete: false})} className="cancelbtn">Cancel</button>
                    </div>
                </form>
                </div>
            }
            {check &&
                <span>
                    <form action="/videos/new" method="get">
                        <button onClick={() => this.props.history.push('/videos/new?ch=' + this.state.data._id)} name="ch" className="btn"><i className="fas fa-file-video"></i> Add video</button>
                    </form>
                    <button onClick={() => this.setState({update: true})} style={{width: "auto"}}><i className="fas fa-video"></i> Update</button>
                    <button onClick={() => this.setState({delete: true})} style={{width: "auto"}}><i className="fas fa-trash"></i> Delete</button>
                </span>
            }
                {this.state.data.videos &&
                    <div className="videos">
                    {this.state.data.videos.map(item => <a key={item._id.toString()} href={"/videos/" + item._id} className="column hover-shadow">
                        <img src={item.poster} alt="poster"/>
                        <p>{item.title}</p>
                    </a>)}
                </div>
                }
            </div>
        </div>
    );
  }
}

export default Channel