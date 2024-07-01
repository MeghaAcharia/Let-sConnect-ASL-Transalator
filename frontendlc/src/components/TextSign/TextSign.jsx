import React, { useEffect, useState } from "react";
import axios from "axios";
import './Textsign.css';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const TextSign = () => {
  const [animations, setAnimations] = useState([]);
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [value, setValue] = useState("");
  const [allVideosPlayed, setAllVideosPlayed] = useState(false);

  const handleRefresh = () => {
    window.location.reload(true); // Pass true to force a full reload
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex + 1 < animations.length) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${animations[currentVideoIndex + 1]}`;
      videoElement.play();
    } else {
      setAllVideosPlayed(true);
    }
  };

  const handleReplay = () => {
    setCurrentVideoIndex(0);
    setAllVideosPlayed(false);
    const videoElement = document.getElementById("video-player");
    videoElement.src = `http://localhost:8000${animations[0]}`;
    videoElement.play();
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

  const handleSignToTextClick = () => {
    navigate('/signtotext'); // Navigate to Page1
  };

  const handleSpeechToSignClick = () => {
    navigate('/speechsign'); // Navigate to Page3
  };

  return (
    <div className="page2">
      <Navbar />
      <div className="mainbox">
        <div className="left">
          <input type="text" placeholder="Type here...." value={value}
            onChange={(e) => setValue(e.target.value.toLowerCase())}
          />
          <button className='p2btn' type="submit" onClick={AnimationList}>Generate Videos</button>
          <button className='p2btn' onClick={handleRefresh}>Refresh</button>
          <div className="navigation-buttons">
            <button className="video-btn" onClick={handleSignToTextClick}>Sign to Text</button>
            <button className="video-btn" onClick={handleSpeechToSignClick}>Speech to Sign</button>
          </div>
        </div>
        <div className="right">
          <div className={`camera-container ${animations ? 'show' : ''}`}>
            {animations.length > 0 ? (
              <div>
                <video className='video-player'
                  id="video-player"
                  width="320"
                  height="200"
                  autoPlay
                  muted
                  preload="auto"
                  onEnded={handleVideoEnd}
                >
                  Your browser does not support the video tag.
                </video>
                {allVideosPlayed && (
                  <button className='p2btn' onClick={handleReplay}>Replay</button>
                )}
              </div>
            ) : (
              <p>Your video will be played here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSign;
