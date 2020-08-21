import React from 'react'
import axios from 'axios'
import './css/new.css'

class NewVideo extends React.Component {
    count = 0;
    url = '';
    format = '';
  constructor(props) {
    super(props);
    this.state = {
        cloudName:'hlrzutjus',
        unsignedUploadPreset:'lzhs5xdj',
        progress:0,
        progressText:'',
        error: false,
        message:''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.video = React.createRef();
    this.poster = React.createRef();
    this.title = React.createRef();
    this.quality = React.createRef();
    this.size = React.createRef();
  }

  uploadFile(file) {
        this.count++;
        let url = `https://api.cloudinary.com/v1_1/${this.state.cloudName}/upload`;
        let fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', this.state.unsignedUploadPreset);
        if(this.count === 1) {
            fd.append('folder', 'videos');
        }
        else {
            fd.append('folder', 'posters');
        }
        axios.post(url, fd, {headers: {
            'Content-Type': 'multipart/form-data'
          },
        onUploadProgress: (e) => {
            let progress = Math.round((e.loaded * 100.0) / e.total);
            if(this.count === 1) {
                this.setState({progress: progress, progressText: progress + "% video"});
            }
            else {
                this.setState({progress: progress, progressText: progress + "% poster"});
            }
        }})
        .then(res => {
            if(this.count === 1) {
                console.log(res.data);
                this.url = res.data.secure_url;
                this.format = res.data.format;
                this.uploadFile(this.poster.current.files[0]);
                return false;
            }
            else {
                let obj = {title: this.title.current.value};
                obj.posterUrl = res.data.secure_url;
                obj.format = this.format;
                obj.size = this.size.current.value;
                obj.quality = this.quality.current.value;
                obj.videoUrl = this.url;
                if(this.props.location.query) {
                  obj.ch = this.props.location.query.ch;
              }
                return axios.post('/api/v1/videos', obj, {headers:{Authorization: `Bearer ${this.props.auth}`}})
            }
        })
        .then(res => {
            if(res) {
                this.props.history.push('/videos/' + res.data._id);
            }
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

  handleSubmit(event) {
    event.preventDefault();
    if (this.title.current.value === '' || this.size.current.value === '' || this.quality.current.value === '' || !this.video.current.files[0] || !this.poster.current.files[0]) {
        this.setState({error: true, message:'Please fill all fields'});
    }
    else if(this.title.current.value.length > 50) {
        this.setState({error: true, message:'Too long title'});
    }
    else if(!this.video.current.files[0].type.startsWith("video/") || !this.poster.current.files[0].type.startsWith("image/")) {
        this.setState({error: true, message:'Wrong file type'});
    }
    else {
        this.uploadFile(this.video.current.files[0]);
    }
  }

  componentWillUnmount() {
      this.count = 0;
      this.url = '';
      this.format = '';
  }

  render() {
    if(!this.props.auth) this.props.history.push('/401');
      const progress = this.state.progress !== 0;
    return (
      <div className="New">
          {this.state.error && 
            <div className="alert alert-danger" id="alert">{this.state.message}</div>
          }
        <form action="/videos/new" method="POST" encType="multipart/form-data" id='form' onSubmit={this.handleSubmit}>
          <div className="line">
            <div className="col-25">
              <label htmlFor="title">Title:</label>
            </div>
            <div className="col-75">
              <input type="text" id="title" name="title" placeholder="Title.." ref={this.title} required />
            </div>
          </div>
          <div className="line">
            <div className="col-25">
              <label htmlFor="quality">Quality:</label>
            </div>
            <div className="col-75">
                <input type="number" name="quality" min="0" ref={this.quality} id="quality" />
            </div>
          </div>
          <div className="line">
              <div className="col-25">
                <label htmlFor="size">Size:</label>
              </div>
              <div className="col-75">
                  <input type="number" name="size" min="0" ref={this.size} id="size" />
              </div>
            </div>
          {progress &&
            <div className="progress">
                <div id="progress" className="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax="100" style={{width:this.state.progress + '%'}}>
                    {this.state.progressText}
                </div>
            </div>
          }
          <div className="line">
            <div className="col-50">
                  <div className="col-md-6">
                      <div className="form-group files">
                          <label>Upload your video </label>
                        <input type="file" className="form-control" name="video" id="video" accept="video/*" ref={this.video} required />
                      </div>   
                  </div>
            </div>
            <div className="col-50">
                      <div className="col-md-6">
                          <div className="form-group files">
                              <label>Upload your poster </label>
                            <input type="file" className="form-control" name="poster" id="poster" accept="image/*" ref={this.poster} required />
                          </div>   
                      </div>
            </div>
          </div>
          <div className="line">
            <input type="submit" value="Submit" id="submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default NewVideo