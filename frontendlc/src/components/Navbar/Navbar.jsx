
import React, { useState, useEffect } from 'react'
import './Navbar.css'
import logo from '../../images/logo.png'
import menu_icon from '../../images/menu-icon.png'
import '../../components/About/About'
import { Link, useLocation } from 'react-router-dom';



function Navbar() {

  const [mobileMenu, setMobileMenu] = useState(false);
  const toggleMenu = ()=>{
    mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
  }

  const [container, setNavClass] = useState('nav'); // Default class
  const location = useLocation();

  useEffect(() => {
    // Check the current pathname and update the navClass state accordingly
    if (location.pathname === "/features" || location.pathname === "/about" || location.pathname === "/contact"
    || location.pathname === "/textsign" || location.pathname === "/speechsign" || location.pathname === "/signtotext"
    ) {
      setNavClass('dark-nav'); // Change class for specific pages
    } else {
      setNavClass('nav'); // Default class for other pages
    }
 }, [location]); // Depend on location to re-run the effect when the pathname changes


  return (
    
    <>
      <nav className={container}>
      <img src={logo} alt="" className='logo' />
      <div className='links'>
        <ul className={mobileMenu?'':'hide-mobile-menu'}>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/features'>Features</Link></li>
          <li><Link to='/about'>About Us</Link></li>
          <li><Link to='/contact'>Contact Us</Link></li>
          <li><Link to='/login'><button className='btn'>Login</button></Link></li>
        </ul>
      </div>
      <img src={menu_icon} alt='' className='menu-icon' onClick={toggleMenu} />
    </nav>
    </>
  )
}

export default Navbar