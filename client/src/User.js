import React from 'react'
import axios from 'axios';
import './css/user.css'

class User extends React.Component {
    owner = {}
  constructor(props) {
    super(props);
    this.state = {
        cloudName:'hlrzutjus',
        unsignedUploadPreset:'lzhs5xdj',
        data: null,
        update: false,
        delete: false
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdmin = this.handleAdmin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fullname = React.createRef()
  }

  handleDelete(e) {
      e.preventDefault();
      axios.delete('/api/v1/users/' + this.state.data._id, {headers:{Authorization: `Bearer ${this.props.auth}`}})
      .then(this.props.history.push('/users'))
      .catch(console.error)
  }

  handleUpdate(e) {
      e.preventDefault();
        this.setState({update: false})
      axios.put('/api/v1/users/' + this.state.data._id,{fullname: this.fullname.current.value}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
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

  handleAdmin(e) {
      e.preventDefault();
      axios.put('/api/v1/users/' + this.state.data._id,{role: "1"}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
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

  handleChange(e) {
      if(e.target.files[0] && e.target.files[0].type.startsWith("image/")) {
        this.uploadFile(e.target.files[0])
      }
  }

  uploadFile(file) {
    let url = `https://api.cloudinary.com/v1_1/${this.state.cloudName}/upload`;
    let fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', this.state.unsignedUploadPreset);
    fd.append('folder', 'avatars');
    axios.post(url, fd, {headers: {
        'Content-Type': 'multipart/form-data'
      }})
      .then(res => {
          return axios.put('/api/v1/users/' + this.state.data._id,{avaUrl: res.data.secure_url}, {headers:{Authorization: `Bearer ${this.props.auth}`}})
      })
      .then(res => this.setState({data: res.data}))
      .catch(err => {
        if(err.response) {
            if(err.response.status === 401) return this.props.history.push('/401')
            else if(err.response.status === 403) return this.props.history.push('/403')
            else if(err.response.status === 404) return this.props.history.push('/404')
        }
        console.error(err);
      });
  }

  async componentDidMount() {
    if(!this.state.data) {
        try {
            if(this.props.auth) {
                let me = await axios.get('/api/v1/me', {headers:{Authorization: `Bearer ${this.props.auth}`}});
                this.owner = me.data;
            }
            let id = this.props.match.params.id;
            if(!id) {id = this.owner._id};
            let res = await axios.get('/api/v1/users/' + id, {headers:{Authorization: `Bearer ${this.props.auth}`}})
            this.setState({data: res.data});
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

  render() {
    if(!this.state.data) return null;
    const check = this.state.data._id === this.owner._id;
    const admin = this.owner.role === 1 && this.state.data.role !== 1;
    return (
        <div className="User">
            <div className="content">
                {check &&
                    <span>
                        <label htmlFor="ava" className="custom-file-upload">
                        <i className="fa fa-user-circle"></i> Avatar
                        </label>
                        <input onChange={this.handleChange} name="ava" type="file" id="ava" accept="image/*"/>
                    </span>
                }
                <img id="user" src={this.state.data.avaUrl} alt="User avatar"/>
                <div className="right">
                    <h2>{this.state.data.fullname}</h2>
                    <h3>{this.state.data.login}</h3>
                    <i>{this.state.data.registeredAt}</i>
                    <h2>Bio:</h2>
                    <p>Some text</p>
                    <p>Some long text</p>
                    <p>Some useless information about user</p>
                    <p>Text text text text text text text text text text text text text text text</p>
                    <p>Text text text text text text text text text text text text text text text</p>
                    <p>Text text text text text text text text text text text text text text text</p>

                    {this.state.update &&
                    <div id="update" className="modal">
                    <form className="modal-content animate" onSubmit={this.handleUpdate} action="" method="post">
        
                        <span onClick={() => this.setState({update: false})} className="close" title="Close Modal">&times;</span>
        
                        <div className="container">
                        <label htmlFor="fullname"><b>Fullname</b></label>
                        <input type="text" placeholder="Enter fullname" name="fullname" defaultValue={this.state.data.fullname} ref={this.fullname} maxLength="50" />
        
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
                                <h2>Are you sure you wanna delete this user?</h2>
                                <button type="submit" className="submit">Delete</button>
                                <button type="button" onClick={() => this.setState({delete: false})} className="cancelbtn">Cancel</button>
                        </div>
                    </form>
                    </div>
                }
                {admin &&
                    <span>
                        <form action="" onSubmit={this.handleAdmin} method="get">
                            <button className="btn" type="submit" name="role"><i class="fas fa-user-secret"></i> Admin</button>
                        </form>
                        <button onClick={() => this.setState({delete: true})} style={{width: "auto"}}><i className="fas fa-trash"></i> Delete</button>
                    </span>
                }
                {check &&
                    <span>
                        <button onClick={() => this.setState({update: true})} style={{width: "auto"}}><i className="fas fa-video"></i> Update</button>
                        <button onClick={() => this.setState({delete: true})} style={{width: "auto"}}><i className="fas fa-trash"></i> Delete</button>
                    </span>
                }
                </div>
                </div>
        </div>
    );
  }
}

export default User