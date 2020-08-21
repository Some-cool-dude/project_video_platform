import React from 'react'
import axios from 'axios';
import './css/video.css'

class Video extends React.Component {
    owner = ''
  constructor(props) {
    super(props);
    this.state = {
        data: null,
        update: false,
        delete: false
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.title = React.createRef()
    this.quality = React.createRef();
    this.size = React.createRef();
  }

  handleDelete(e) {
      e.preventDefault();
      axios.delete('/api/v1/videos/' + this.state.data._id, {headers:{Authorization: `Bearer ${this.props.auth}`}})
      .then(this.props.history.push('/videos'))
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
      axios.put('/api/v1/videos/' + this.state.data._id,{title: this.title.current.value, size: this.size.current.value, quality: this.quality.current.value}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
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

  componentDidMount() {
    if(!this.state.data) {
        if(this.props.auth) {
            axios.get('/api/v1/me', {headers:{Authorization: `Bearer ${this.props.auth}`}})
            .then(res => {
                this.owner = res.data._id;
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
        axios.get('/api/v1/videos/' + this.props.match.params.id)
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
        });
    }
  }

  render() {
    if(!this.state.data) return null;
    const check = this.state.data.user_id === this.owner;
    return (
        <div className="Video">
            <div className="content">
                <video width="853" height="480" poster={this.state.data.poster} controls>
                    <source src={this.state.data.urlPath} type={"video/" + this.state.data.format}/>
                    Your browser does not support the video tag.
                </video>
                <p><b>Format:</b>{this.state.data.format}</p>
                <p><b>Quality:</b>{this.state.data.quality}</p>
                <p><b>Size:</b>{this.state.data.size}</p>
                <p><b>Added:</b><i>{this.state.data.addedAt}</i></p>
                {this.state.update &&
                <div id="update" className="modal">
                <form className="modal-content animate" onSubmit={this.handleUpdate} action="" method="post">
    
                    <span onClick={() => this.setState({update: false})} className="close" title="Close Modal">&times;</span>
    
                    <div className="container">
                    <label htmlFor="title"><b>Title</b></label>
                    <input type="text" placeholder="Enter title" name="title" defaultValue={this.state.data.title} ref={this.title} maxLength="50" />
    
                    <label htmlFor="size"><b>Size</b></label>
                    <input type="number" min="0" defaultValue={this.state.data.size} ref={this.size} name="size" />
    
                    <label htmlFor="quality"><b>Quality</b></label>
                    <input type="number" min="0" defaultValue={this.state.data.quality} ref={this.quality} name="quality" />
                        
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
                            <h2>Are you sure you wanna delete this video?</h2>
                            <button type="submit" className="submit">Delete</button>
                            <button type="button" onClick={() => this.setState({delete: false})} className="cancelbtn">Cancel</button>
                    </div>
                </form>
                </div>
            }
            {check &&
                <span>
                    <button onClick={() => this.setState({update: true})} style={{width: "auto"}}><i className="fas fa-video"></i> Update</button>
                    <button onClick={() => this.setState({delete: true})} style={{width: "auto"}}><i className="fas fa-trash"></i> Delete</button>
                </span>
            }
            </div>
        </div>
    );
  }
}

export default Video