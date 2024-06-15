
import React from 'react'
import './Header.css'
import dark_arrow from '../../images/dark-arrow.png'
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='header' id='header'>
      <Navbar />
      <div className='header-text'>
        <h1>Let's Connect</h1>
        <p>ASL Sign Language Translator using Deep Learning</p>
        <Link to='/features'><button className='e-btn'>Explore more<img src={dark_arrow} alt='' /></button></Link>
      </div>
    </div>
  )
}

export default Header