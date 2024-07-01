
import React from 'react'
import './Contact.css'
import Navbar from '../Navbar/Navbar'
import msg_icon from '../../images/msg-icon.png'
import mail_icon from '../../images/mail-icon.png'
import phone_icon from '../../images/phone-icon.png'
import location_icon from '../../images/location-icon.png'
import white_arrow from '../../images/white-arrow.png'

const Contact = () => {

    const [result, setResult] = React.useState("");

    const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "c13dd384-20b7-483f-abfa-28e29a4f4a75");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className='div1'>
      <Navbar />
      <h2>Contact Us</h2>
      <h3>Get in Touch</h3><br />
      <div className='contact' id='contact'>
        <div className='contact-col'>
          <h2>Send us a message <img src={msg_icon} alt='' /></h2>
          <p>Feel free to reach out through contact from or find our contact
            information below. Your feedback, questions, and suggestions are
            important to us as we strive to provide exceptional service to
            our users.
          </p>
          <ul>
            <li><img src={mail_icon} alt='' />letsconnect.reach@gmail.com</li>
            <li><img src={phone_icon} alt='' />+91 8756341243</li>
            <li><img src={location_icon} alt='' />Goa College of Engineering, Farmagudi, Ponda-Goa 403401</li>
          </ul>
        </div>
        <div className='contact-col'>
          <form onSubmit={onSubmit}>
            <label>Your Name</label>
            <input type='text' name='name' placeholder='Enter your name' required />
            <label>Phone Number</label>
            <input type='tel' name='phone' placeholder='Enter your mobile number' required />
            <label>Write your message here</label>
            <textarea name='message' rows='6' placeholder='Enter your message'></textarea>
            <button type='submit' className='dark-btn'>Submit now<img src={white_arrow} alt='' /></button>
          </form>
          <span>{result}</span>
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
  )
}


export default Contact