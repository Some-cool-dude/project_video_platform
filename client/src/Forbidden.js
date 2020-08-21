import React from 'react'
import './css/403.css'

class Forbidden extends React.Component {
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
      <div className="Forbidden">
        <div className="space"></div>
        <center>
                    <div>
                        4
                    </div>
                    <div className="ban">
                        <img id="ban" src="./images/forb.jpeg" alt="ban"></img>
                    </div>
                    <div>
                        3
                    </div>
                    <p><a href="">You ara not admin</a></p>    
        </center>
        <div className="space"></div>
      </div>
    )
  }
}

export default Forbidden