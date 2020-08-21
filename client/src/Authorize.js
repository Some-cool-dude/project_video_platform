import React from 'react'
import './css/401.css'

class Authorize extends React.Component {
  componentDidMount() {
    let nav = document.getElementById('nav');
    let footer = document.getElementById('footer');
    nav.style.display = "none";
    footer.style.display = "none";
  }

  componentWillUnmount() {
    let nav = document.getElementById('nav');
    let footer = document.getElementById('footer');
    nav.style.display = "block";
    footer.style.display = "block";
  }

  render() {
    return (
      <div className="Authorize">
        <div className="space"></div>
        <center>
                    <div className="author">
                        <img id="author" src="./images/authorize.png" alt="authorize"></img>
                    </div>
                    <p><a href="/login">login please</a></p>    
        </center>
        <div className="space"></div>
      </div>
    )
  }
}

export default Authorize