
// import React, { useState, useRef } from "react";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from '../Navbar/Navbar';
import './Signtotext.css';
import { useLayoutEffect } from "react";

const SignToText = () => {
  function sendData() {}

  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [recordedChunksSai, setRecordedChunksSai] = useState([]);
  const [text, setText] = useState("");
  let model_text;
  const [showVideo, setShowVideo] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleRefresh = () => {
    window.location.reload(true); // Pass true to force a full reload
  };

  
  const handleStartCapture = () => {
    console.log("starts capturing");
    setIsCapturing(true);
    recordedChunksRef.current = [];
    setShowVideo(true);
    // Reset the recorded chunks

    // // Create a new MediaRecorder instance
    // mediaRecorderRef.current = new MediaRecorder(videoRef.current.srcObject);

    // // Register event handlers for the MediaRecorder
    // mediaRecorderRef.current.ondataavailable = (event) => {
    //   recordedChunksRef.current.push(event.data);
    //   console.log("Chunks:", recordedChunksRef.current); // Log the chunks here
    // };

    // // Start recording
    // mediaRecorderRef.current.start();

    const video = videoRef.current;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.start();
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  };

  const handleDataAvailable = (event) => {
    console.log("Sai....", event.data);
    if (event.data && event.data.size > 0) {
      recordedChunksRef.current = [...recordedChunksRef.current, event.data];
      // setRecordedChunksSai((recordedChunksSai) => [
      //   ...recordedChunksSai,
      //   event.data,
      // ]);
    }
    SaveVideo();
  };

  const handleStopCapture = () => {
    console.log("stops rec");
    // setIsCapturing(false);
    // videoRef.current.pause();
    // Show the output box when the Stop button is clicked
    setShowOutput(true);
    // Hide the video
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsCapturing(false);
    // SaveVideo();
  };

  const SaveVideo = () => {
    console.log("enters save");
    console.log("Sai: ", recordedChunksRef.current);
    const videoBlob = new Blob(recordedChunksRef.current, {
      type: "video/webm",
    });
    console.log("blob data", videoBlob);

    // Create a FormData object to send the video file
    const formData = new FormData();
    formData.append("videoFile", videoBlob, "recorded-video.webm");
    console.log("form data", formData);

    // Send the video file to the server using Axios or any other HTTP library
      axios
        .post("http://localhost:8000/api/v1/auth/asl_sign_detection", formData)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            model_text = response.data.txt;
            console.log("model_text", model_text);
            console.log("Video saved successfully");
            console.log(response.data.txt);
            setText(response.data.txt);
          }
        })
        .catch((error) => {
          console.error("Error saving video:", error);
        });
    
  };
  const textareaRef = useRef(null);
  const [backgroundHeight, setBackgroundHeight] = useState(0);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setBackgroundHeight(textareaRef.current.scrollHeight);
    }
  }, []);

  const handleInputChange = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setBackgroundHeight(e.target.scrollHeight);
  };


return (
  <div>
      <div className="page1">
      <Navbar />
      <div className="mainbox1">
      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        // playsInline
                      />
        {!isCapturing && (
          <button className="start-btn" onClick={handleStartCapture}>Start</button>
        )}
        {isCapturing && (
          <button className="stop-btn" onClick={handleStopCapture}>Stop</button>
        )}
        {showOutput && (
          <div className="output-box">
            {text}
          </div>
        )}
              <button className='p2btn' onClick={handleRefresh}>Back</button>
  </div>
  </div>
    </div>

);
};
export default SignToText;
