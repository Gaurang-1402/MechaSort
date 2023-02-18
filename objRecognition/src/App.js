import { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Webcam from "react-webcam";

const STREAM_WIDTH_RATIO = 0.6
const STREAM_HEIGHT_RATIO = 0.9

function VideoStream({ detections }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasTimeout = useRef(null);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (detections.length){
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearTimeout(canvasTimeout.current);
      canvasTimeout.current = setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 1500);
      drawCanvas(context, detections, windowSize.current[0] * STREAM_WIDTH_RATIO, windowSize.current[1] * STREAM_HEIGHT_RATIO)
    }
  }, [detections]);


  function drawCanvas(context, detections, windowWidth, windowHeight) {
    for (const detection of detections) {
      console.log(detection)
      context.beginPath();
      let x = detection.x * windowWidth
      let y = detection.y * windowHeight
      let width = detection.width * windowWidth
      let height = detection.height * windowHeight
      context.rect(x, y, width, height);
      context.strokeStyle = 'red';
      context.lineWidth = 2;
      context.stroke();
      context.font = "28px Arial";
      context.fillStyle = "red";
      context.fillText(
        detection.class.toUpperCase() +
          ": " +
          Math.round(parseFloat(detection.probability) * 100) +
          "%",
        x, detection.y > 0.1 ? y - 10 : y + height + 30
      );
    }
  }

  const videoConstraints = {
    width: windowSize.current[0] * STREAM_WIDTH_RATIO,
    height: windowSize.current[1] * STREAM_HEIGHT_RATIO,
    facingMode: "environment",
  };

  return (
    <div>
      <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            style={{position: 'absolute', left: '20px', top: '20px'}}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
    />
    <canvas ref={canvasRef} style={{position: 'absolute', left: '20px', top: '20px'}}></canvas>
    </div>
  );
}

function App() {
  const [pillCount, setPillCount] = useState(0)
  const [detections, setDetections] = useState([])

  useEffect(() => {
    const socket = io('http://localhost:65534');

    socket.on('detections', (detections) => {
      setPillCount(pillCount + 1)
      setDetections(detections)
    });

    return () => {
      socket.disconnect();
    };
  }, [pillCount]);

  return (
    <VideoStream detections={detections}/>
  );
}

export default App