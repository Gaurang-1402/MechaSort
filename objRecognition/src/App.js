import { useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Webcam from "react-webcam";

function VideoStream() {
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:65534');
    const webcam = webcamRef.current
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    socket.on('detections', (detections) => {
      context.clearRect(0, 0, 1080,1920);
      // context.drawImage(webcam, 0, 0, canvas.width, canvas.height);
      for (const detection of detections) {
        console.log(detection)
        context.beginPath();
        context.rect(detection.x, detection.y, detection.width, detection.height);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.stroke();
      }
    });

    // video.addEventListener('loadedmetadata', () => {
    //   canvas.width = video.videoWidth;
    //   canvas.height = video.videoHeight;
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  const videoConstraints = {
    height: 1080,
    width: 1920,
    // height: 120,
    facingMode: "environment",
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{position: 'absolute'}}></canvas>
      <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            //  width={640}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
    />
    </div>
  );
}

function App() {
    return (
      <VideoStream />
    );
}

export default App