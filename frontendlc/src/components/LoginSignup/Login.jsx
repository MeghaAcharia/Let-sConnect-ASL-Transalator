import axios from 'axios'
import React, {useState} from 'react'
import { toast } from 'react-toastify'
import './Login.css'
import Navbar from '../Navbar/Navbar'
import login1 from '../../images/login.png'
import { Link ,useNavigate} from 'react-router-dom';

const Login = () => {
  const navigate=useNavigate()
  const [logindata, setLogindata]=useState({
    email:"",
    password:""
})
  const [error, setError]= useState("")
  const [isLoading, setIsLoading]= useState(false)

  const handleOnchange=(e)=>{
  setLogindata({...logindata, [e.target.name]:e.target.value})
}
  const handleSubmit = async(e)=>{
    e.preventDefault()
    const {email, password}=logindata
    if (!email || !password) {
        setError("email and password are required")
    }
    else{
      setIsLoading(true)
      const res = await axios.post("http://localhost:8000/api/v1/auth/login/",logindata)
      const response= res.data
      console.log(response)
      setIsLoading(false)
      const user={
        "email": response.email,
        "full_name": response.full_name
      }
      if(res.status===200){
        localStorage.setItem("user",JSON.stringify(user))
        localStorage.setItem('access',JSON.stringify(response.access_token))
        localStorage.setItem('refresh', JSON.stringify(response.refresh_token))
        navigate("/features")
        toast.success("login successful")
      }
    }
 
}

  return (
    <div className="login">
    <Navbar />
    <div className="form1-popup">
        <div className="form1-description">
            <p>Please log in using your personal information to stay connected with us.</p>
        </div>
        <div className="form1-box">
            <div className="form1-details">
                    <h2>Welcome Back</h2>
                    {/* <p>Please log in using your personal information to stay connected with us</p> */}
            </div>
            <div className="form1-content">
                <h2>LOGIN</h2>
                <div className="form-wrapper"> {/* Added wrapper */}
                  <form onSubmit={handleSubmit}>
                      <div className='inputs'>
                          <label htmlFor='email'><strong>Email</strong></label><br />
                          <input type='email' placeholder='Enter Email' required value={logindata.email}  
                     onChange={handleOnchange} />
                      </div>
                      <div className='inputs'>
                          <label htmlFor='password'><strong>Password</strong></label><br />
                          <input type='password' placeholder='Enter Password' required value={logindata.password}
                   onChange={handleOnchange} />
                      </div>
                      <br/><a href="" className='forgot-pass'>Forgot password?</a>
                      <button type='submit' className='log-btn'>Log In</button>
                      
                  </form>
                </div>
                <div className="signup-link">
                    Don't have an Account? 
                    <Link to='/signup'>  Sign Up</Link>
                </div>
            </div>
        </div>
    </div>
</div>
)
}

export default Login
