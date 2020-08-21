import React from 'react'
import './css/404.css'

class PageNOtFound extends React.Component {
  componentDidMount() {
    let pupil = document.getElementById('pupil');
    let nav = document.getElementById('nav');
    let footer = document.getElementById('footer');
    nav.style.display = "none";
    footer.style.display = "none";
    document.addEventListener('mousemove', event => {
      let x = event.clientX * 100 / window.innerWidth + "%";
      let y = event.clientY * 100 / window.innerHeight + "%";
      pupil.style.left = x;
      pupil.style.top = y;
      pupil.style.transform = `translate(-${x}, -${y})`;
    });
  }

  componentWillUnmount() {
    let pupil = document.getElementById('pupil');
    let nav = document.getElementById('nav');
    let footer = document.getElementById('footer');
    nav.style.display = "block";
    footer.style.display = "block";
    document.removeEventListener('mousemove', event => {
      let x = event.clientX * 100 / window.innerWidth + "%";
      let y = event.clientY * 100 / window.innerHeight + "%";
      pupil.style.left = x;
      pupil.style.top = y;
      pupil.style.transform = `translate(-${x}, -${y})`;
    });
  }

  render() {
    return (
      <div className="PageNotFound">
        <div className="space"></div>
        <center>
                    <div>
                        4
                    </div>
                    <div className="eye">
                        <img id="pupil" src="https://res.cloudinary.com/hlrzutjus/image/upload/v1576349822/pupil_qebphp.png" alt="pupil"></img>
                    </div>
                    <div>
                        4
                    </div>
                    <p><a href="/">Run from here</a></p>    
        </center>
        <div className="space"></div>
      </div>
    )
  }
}

export default PageNOtFound