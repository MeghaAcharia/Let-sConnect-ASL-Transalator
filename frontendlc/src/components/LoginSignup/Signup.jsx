import React, {useEffect, useState} from 'react'
import axios from "axios"
import { toast } from "react-toastify";
import './Signup.css'
import Navbar from '../Navbar/Navbar'
import { Link ,useNavigate} from 'react-router-dom'

const Signup = () => {
  const navigate=useNavigate()
    const [formdata, setFormdata]=useState({
        email:"",
        first_name:"",
        last_name:"",
        password:"",
        password2:""
    })
    const [error, setError]=useState("")

    

    const handleOnchange = (e)=>{
        setFormdata({...formdata, [e.target.name]:e.target.value})
    }


    const {email, first_name, last_name, password, password2}=formdata
   
    const handleSubmit =async (e)=>{
        e.preventDefault()
        if(!email || !first_name || !last_name || !password || !password2){
          setError("all fields are required!!")
        }
        else{
        console.log(formdata)
        //make call to api
        const res= await axios.post("http://localhost:8000/api/v1/auth/register/", formdata)
        //check our response
        const response= res.data
        console.log(response)
        if (res.status===201){
          //redirect to verifyemail
          navigate("/otp/verify")
          toast.success(response.message)

        }
        
        //server error pass to error
    }
    console.log(error)
  }

  return (
    <div className="signup">
        <Navbar />
        <div className="form2-popup">
            <div className="form2-description">
                <p>To become a part of our community, please sign up using your personal information to stay connected with us.</p>
            </div>
            <div className="form2-box">
                <div className="form2-details">
                    <h2>Create Account</h2>
                    {/* <p>To become a part of our community, please sign up using your personal information to stay connected with us</p> */}
                </div>
                <div className="form2-content">
                    <h2>SIGNUP</h2>
                    <div className="wrapper">
                        <form onSubmit={handleSubmit} name='form2'>
                        <div className='inputs'>
                            <label htmlFor='fname'><strong>First name</strong></label><br />
                            <input type='text' placeholder='Enter your First Name' required value={first_name} 
                  onChange={handleOnchange} />
                        </div>
                        <div className='inputs'>
                            <label htmlFor='lname'><strong>Last name</strong></label><br />
                            <input type='text' placeholder='Enter your Last Name' required value={last_name} 
                 onChange={handleOnchange} />
                        </div>
                        <div className='inputs'>
                            <label htmlFor='email'><strong>Email</strong></label><br />
                            <input type='email' placeholder='Enter your Email' required value={email}  
                  onChange={handleOnchange} />
                        </div>
                        <div className='inputs'>
                            <label htmlFor='password'><strong>Create Password</strong></label><br />
                            <input type='password' placeholder='Enter strong Password' required value={password} 
                 onChange={handleOnchange} />
                        </div>
                        <div className='inputs'>
                            <label htmlFor='cpassword'><strong>Confirm Password</strong></label><br/>
                            <input type='password' placeholder='Confirm Password' required  value={password2} 
                 onChange={handleOnchange}/>
                        </div>
                        <br/><br/>
                        <div className="policy-text">
                            <input type='checkbox' id='policy' required/>
                            <label for="policy"> I  agree to the
                            <a href='#'> Terms & Conditions</a></label>
                        </div>
                        <button type='submit' className='sign-btn'>Sign Up</button>
                    </form>
                    </div>
                    
                    <div className="signup-link">
                        Already have an Account? 
                        <Link to='/login'>  Login</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Signup