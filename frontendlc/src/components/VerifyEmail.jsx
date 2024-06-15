import axios from 'axios'
import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from './Navbar/Navbar'

const VerifyEmail = () => {
  const [otp, setOtp] = useState("")
  const navigate=useNavigate()

  const handleOtpSubmit = async(e)=>{
    e.preventDefault()
    if (otp) {
        const respond = await axios.post('http://localhost:8000/api/v1/auth/verify-email/', {'otp':otp})
        if (respond.status === 200) {
            navigate("/login")
            toast.success(respond.data.message)
        }
        
    }
    
}
  return (
    <div>
      <Navbar/>
      <div className='form-container'>
      <form onSubmit={handleOtpSubmit} >
               <div className='form-group'>
                 <label htmlFor="">Enter your Otp code:</label>
                 <input type="text"
                  className='email-form'  
                  name="otp"
                  value={otp}
                  onChange={(e)=>setOtp(e.target.value)} 
                   />
               </div>
               <input type='submit' className='vbtn' value="Send"/>
            </form>
      </div>
    </div>
  )
}

export default VerifyEmail