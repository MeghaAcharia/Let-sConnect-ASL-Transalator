import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from '../Navbar/Navbar';
import './Speechsign.css';
import { useNavigate } from 'react-router-dom';

const SpeechSign = () => {
  const [text1, setText] = useState("please talk ...");
  const [animations, setAnimations] = useState([]);
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [allVideosPlayed, setAllVideosPlayed] = useState(false);
  let recognisedText;
  const videoRef = useRef(null);
  const [value, setValue] = useState("");

  const handleRefresh = () => {
    window.location.reload(true); // Pass true to force a full reload
  };

  const navigateToPage1 = () => {
    navigate('/signtotext');
  };

  const navigateToPage2 = () => {
    navigate('/textsign');
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

  const AnimationList = async (to_be_animated) => {
    while (animations.length !== 0) {
      animations.pop();
    }

    console.log("animation list:", animations);
    console.log("data sent:", text1);
    console.log("recognised text data:", recognisedText);

    axios
      .post("http://localhost:8000/api/v1/auth/text_sign", {
        text: to_be_animated,
      })
      .then((response) => {
        console.log(response.data.text);

        axios
          .post("http://localhost:8000/api/v1/auth/animate", {
            tags: response.data.text,
          })
          .then((response) => {
            console.log(response);
            console.log("ANIMATE RETURNS", response.data.videos);
            setAnimations(response.data.videos);
            setCurrentVideoIndex(0);
          });
      });
  };

  function handleCommunication() {
    console.log("inside handlecomm");
    setCurrentVideoIndex(0);
    AnimationList(recognisedText);
  }

  async function speech_to_text() {
    setText("Please Talk...");
    setValue(null);
    setRecording(true); // Start recording
    await axios
      .get("http://localhost:8000/api/v1/auth/speech_text")
      .then((response) => {
        console.log("TEXT:", response.data.text);
        setText(response.data.text);
        recognisedText = response.data.text;
        console.log("response data:", text1);
        console.log("recognised text data:", recognisedText);
        setRecording(false); // Stop recording
        handleCommunication();
      })
      .catch((error) => {
        console.log(error);
        setRecording(false); // Stop recording
      });
  }

  useEffect(() => {
    if (animations.length > 0) {
      const videoElement = document.getElementById("video-player");
      videoElement.src = `http://localhost:8000${animations[0]}`;
      videoElement.play();
    }
  }, [animations]);

  return (
    <div className="page3">
      <Navbar />
      <div className="mainbox">
        <div className="left">
          <button className="p3btn" type="submit" onClick={speech_to_text}>
            Please Speak
          </button>
          {recording && <p>Microphone is recording...</p>}
          <button className="p3btn refresh-btn" onClick={handleRefresh}>
            Refresh
          </button>
          <div className="navigation-buttons">
            <button className="video-btn" onClick={navigateToPage1}>
              Sign to Text
            </button>
            <button className="video-btn" onClick={navigateToPage2}>
              Text to Sign
            </button>
          </div>
        </div>
        <div className="right">
          <div className="camera-container">
            {animations.length > 0 ? (
              <div>
                <video
                  className="video-player2"
                  id="video-player"
                  width="320"
                  height="240"
                  autoPlay
                  muted
                  onEnded={handleVideoEnd}
                >
                  Your browser does not support the video tag.
                </video>
                {allVideosPlayed && (
                  <button className="p2btn" onClick={handleReplay}>
                    Replay
                  </button>
                )}
              </div>
            ) : (
              <p>Loading videos...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechSign;
