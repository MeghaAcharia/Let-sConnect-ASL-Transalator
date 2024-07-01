
import React from 'react'
import './About.css'
import Navbar from '../Navbar/Navbar'
import feature_3 from '../../images/feature_3.png'

const About = () => {
  return (
    <div className='about' id='about'>
      <Navbar />
      <div className='about-content'>
        <div className='about-left'>
          <img src={feature_3} alt='' className='about-img' />
        </div>
        <div className='about-right'>
          <h3>ABOUT US</h3>
          <h2>ASL Sign Language Translator</h2>
          <p>Welcome to Let's Connect, where we bridge the communication gap for the deaf 
              community with our innovative ASL sign language translator. Our mission is to 
              empower deaf individuals by providing them with a seamless platform to express 
              themselves effortlessly. Through cutting-edge technology, we convert sign 
              language into text and audio, and vice versa, facilitating smooth communication 
              and fostering inclusivity. At Let's Connect, we believe in the power of connection 
              and strive to create a world where everyone can communicate freely, regardless of 
              their hearing abilities. Join us on this journey towards a more accessible and connected future.</p>
        </div>
      </div>
      <div className="footer">
        <p>2024 Let's Connect. All rights reserved.</p>
        <ul>
          <li>Terms of Services</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
    </div>
  );
}

export default About