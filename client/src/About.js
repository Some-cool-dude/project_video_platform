import React from 'react'
import './css/about.css'

class About extends React.Component {
  render() {
    return (
      <div className="About">
        <img id="ava" src="images/ava.jpg" alt="Avatar"></img>
        <h1>About me</h1>
        <center>
            <p>Hi! I'm Adrew. I created this site. It was hard,</p>
            <p>but i did it. That is all what you need to know.</p>
            <p><b>Name:</b> Andrew Shylo</p>
            <p><b>Email:</b> consequence098@gmail.com</p>
            <p><b>Telegram:</b> @SaintAtheist</p>
        </center>
      </div>
    );
  }
}

export default About