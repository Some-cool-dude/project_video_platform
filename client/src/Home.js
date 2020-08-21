import React from 'react'
import './css/home.css'

class Home extends React.Component {

  componentDidMount() {
      let pupil = document.getElementById('pupil');
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
      <div className="Home">
        <h1><i>AndrewsBestsite</i></h1>
        <div className="eye">
                <img id="pupil" src="https://res.cloudinary.com/hlrzutjus/image/upload/v1576349822/pupil_qebphp.png" alt="pupil"></img>
                <div className="eyelid_up"></div>
                <div className="eyelid_down"></div>
                
        </div>
        <img id="shadow" src="images/shadow.png" alt="shadow"></img>
        <div className="content">
                <h2>Description:</h2>
                <p>
                This site created to show my <del>limited</del> profesional skills in web-developing. 
                In the future this site will turn in <b>videoplatform.</b>   
                </p>
                <p>
                It does not show useful information. Currently this site just test to understand how it works.
                </p>
                <p>Hover on eye.</p>
        </div>
      </div>
    );
  }
}

export default Home