import React, {useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const jwt_access=localStorage.getItem('access')
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();

   useEffect(() => {
     if (jwt_access === null && !user) {
         navigate('/login')
     }else{
      getSomeData()
     }
     
   }, [jwt_access,user])

  const getSomeData =async ()=>{
      const res =await axiosInstance.get("auth/profile/")
      if(res.status===200){
        console.log(res.data)
      }
  }

  
  const refresh=JSON.parse(localStorage.getItem('refresh'))
  

  const handleLogout = async ()=>{
    const res = await axiosInstance.post("auth/logout/", {"refresh_token":refresh})
    if (res.status === 200) {
         localStorage.removeItem('access')
         localStorage.removeItem('refresh')
         localStorage.removeItem('user')
         navigate("/login")
         toast.success("logout successful")
    }
  }
  return (
    <div className='container'>
        <h2>hi {user && user.full_name}</h2>
        <p style={{textAlign:'center',}}>welcome to your profile</p>
        <button onClick={handleLogout} className='logout-btn'>Logout</button>
    </div>
  )
}

export default Profile