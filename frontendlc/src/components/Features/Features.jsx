import '../SignToText/SignToText'
import React from 'react'
import './Features.css'
import Navbar from '../Navbar/Navbar'
import camera from '../../images/icon_camera.png'
import keyboard from '../../images/icon_key.png'
import mic from '../../images/icon_mic.png'
import { Link } from 'react-router-dom'

const Features = () => {
  return (
    <div className='features'>
        <Navbar />
        <div className="cover1">
          <div className="f-left">
            <img src={camera} alt='' className='f-img'/>
          </div>
          <Link to='/signtotext'>
          <div className="f-right">
            <h1>Sign To Text</h1>
            <p>This feature enables seamless communication by instantly converting sign 
              language gestures into written text, empowering accessibility and understanding.
              Ensure the sign is clear and well-lit for accurate recognition.</p>
          </div>
          </Link>
        </div>

        <div className="cover2">
          <div className="f-left">
            <img src={keyboard} alt='' className='f-img'/>
          </div>
          <Link to='/textsign'>
          <div className="f-right">
            <h1>Text To Sign</h1>
            <p>This feature bridges the gap between text-based communication and sign 
              language, fostering inclusivity and enhancing accessibility across diverse audiences.
              Input the desired text you want to convert into sign language. </p>
          </div>
          </Link>
        </div>

        <div className="cover3">
          <div className="f-left">
            <img src={mic} alt='' className='f-img'/>
          </div>
          <Link to='/speechsign'>
          <div className="f-right">
            <h1>Speech To Sign</h1>
            <p>This feature facilitates seamless communication by transcribing spoken
             words into sign gestures.. Speak clearly into your device's microphone, 
             articulating each word for accurate transcription.</p>
          </div>
          </Link>
        </div>
    </div>
    
  )
}

export default Features
