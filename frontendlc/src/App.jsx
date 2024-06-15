//import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {Signup, Login , Profile , VerifyEmail , ForgetPassword , ResetPassword} from "./components"
import Header from './components/Header/Header'
import Features from './components/Features/Features'
import About from './components/About/About'
import Contact from './components/Contact/Contact'
import SignToText from './components/SignToText/SignToText'
import TextSign from './components/TextSign/TextSign'
import SpeechSign from './components/SpeechSign/SpeechSign'

import "./App.css"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const App = () =>{
 
  return (
      <Router>
        <ToastContainer />
        <Routes>
        <Route path='/' element={<Header/>}></Route>
        <Route path='/features' element={<Features/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/dashboard' element={<Profile/>}></Route>
        <Route path='/otp/verify' element={<VerifyEmail/>}></Route>
        <Route path='/forget-password' element={<ForgetPassword/>}></Route>
        <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>}/>
        <Route path='/signtotext' element={<SignToText/>}/>
        <Route path='/textsign' element={<TextSign/>}/>
        <Route path='/speechsign' element={<SpeechSign/>}/>
        </Routes>
      </Router>
  )
}

export default App