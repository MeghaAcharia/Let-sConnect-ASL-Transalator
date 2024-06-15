import React, { useEffect, useState } from "react";
import axios from "axios";
import './Textsign.css'
import Navbar from '../Navbar/Navbar'

const TextSign = () => {
  const [animations, setAnimations] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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
      videoElement.src =`http://localhost:8000${nextVideoUrl}`;
      //videoElement.play();
    } else {
      // Optionally, reset to the first video if you want to loop
      setCurrentVideoIndex(0);
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${animations[0]}`;
      videoElement.play();
    }
  };

  const AnimationList = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/auth/text_sign", {
        text: value,
      });

      const animateResponse = await axios.post("http://localhost:8000/api/v1/auth/animate", {
        tags: response.data.text,
      });
      console.log(animateResponse.data.videos);
      setAnimations(animateResponse.data.videos);
      console.log()
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

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
    <div className="page2">
    <Navbar/>
    <div className="mainbox">
    
        <input
          type="text"
          placeholder="Type here...."
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
      
    <button className='p2btn' type="submit"onClick={AnimationList}>Generate Videos</button>
    <button className='p2btn' onClick={handleRefresh}>Back</button>
    <div>
    {animations.length > 0? (
          <video className='video-player'
            id="video-player"
            width="320"
            height="200"
            autoPlay
            muted
            preload="auto"
            controls
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <p></p>
        )}

        </div>
        
    </div>

  </div>

    </div>
  );
};

export default TextSign;
