import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from '../Navbar/Navbar';
import './Speechsign.css'

const SpeechSign = () => {
 
  const [text1, setText] = useState("please talk ...");
  const [animations, setAnimations] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  let recognisedText;
  const videoRef = useRef(null);
  const [value, setValue] = useState("");

  const handleRefresh = () => {
    window.location.reload(true); // Pass true to force a full reload
  };
  
  const handleVideoEnd = () => {
    // Directly set the src to the next video URL
    const nextVideoUrl = animations[currentVideoIndex + 1];
    if (nextVideoUrl) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${nextVideoUrl}`;
      videoElement.play();
    } else {
      // Optionally, reset to the first video if you want to loop
      setCurrentVideoIndex(0);
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${animations[0]}`;
      videoElement.play();
    }
  };


  const AnimationList = async (to_be_animated) => {
    while (animations.length != 0) {
      animations.pop();
    }
    // setAnimations([]);
    console.log("animation list:", animations);
    console.log("data sent:", text1);
    console.log("recognised text data:", recognisedText);
    // calling nltk

    console.log("value:", value);

    axios
      .post("http://localhost:8000/api/v1/auth/text_sign", {
        // text: recognisedText,
        text: to_be_animated,
      })
      .then((response) => {
        console.log(response.data.text);
        // setValue(null);
        axios
          .post("http://localhost:8000/api/v1/auth/animate", {
            tags: response.data.text,
          })
          .then((response) => {
            console.log(response);
            console.log("ANIMATE RETURNS", response.data.videos);
            setAnimations(response.data.videos);
            animations.push(response.data.videos);
            console.log("animations:", animations);
            setCurrentVideoIndex(0);
            setShowVideos(true);
          });
      });
  };

  function handleCommunication() {
   
      console.log("inside handlecomm");
      // addToList();
      setCurrentVideoIndex(0);
      AnimationList(recognisedText);
      // AnimationList();
    }
  

  async function speech_to_text() {
    setText("Please Talk...");
    setValue(null);
    await axios
      .get("http://localhost:8000/api/v1/auth/speech_text")
      .then((response) => {
        console.log("TEXT:", response.data.text);
        setText(response.data.text);
        recognisedText = response.data.text;
        console.log("response data:", text1);
        console.log("recognised text data:", recognisedText);
        handleCommunication();
      })
      .catch(console.log);
  }

  useEffect(() => {
    if (animations.length > 0) {
      // Start playing the first video when animations are available
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${animations[0]}`;
      videoElement.play();
    }
  }, [animations]);

  return (
    <div>
       <div className="page3">
      <Navbar />
      <div className="mainbox2">
        <button className='p3btn' type="submit" onClick={speech_to_text}>Please Speak</button>
        <div>
        {animations.length > 0? (
          <video
            className="video-player2"
            id="video-player"
            width="320"
            height="240"
            autoPlay
            muted
            controls={true}
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>Loading videos...</p>
        )}
      </div>
      <button className='p2btn' onClick={handleRefresh}>Back</button>
          <div>{text1}</div>
      </div>
    </div>
      
    </div>
  );
};
export default SpeechSign;