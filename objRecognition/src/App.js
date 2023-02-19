import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Webcam from "react-webcam";
import RobotArm from "./RobotArm.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
 } from 'chart.js';
 import { Line } from 'react-chartjs-2';
 import "./App.css";
 
 ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
 );
 
const STREAM_WIDTH_RATIO = 0.7;
const STREAM_HEIGHT_RATIO = 0.8;
const RASPBERRY_PI_STREAM_ADDR = "http://192.168.8.115:5000/video_feed";

function VideoStream({ detections }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasTimeout = useRef(null);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (detections.length) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      clearTimeout(canvasTimeout.current);
      canvasTimeout.current = setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }, 1500);
      drawCanvas(
        context,
        detections,
        windowSize.current[0] * STREAM_WIDTH_RATIO,
        windowSize.current[1] * STREAM_HEIGHT_RATIO
      );
    }
  }, [detections]);

  function drawCanvas(context, detections, windowWidth, windowHeight) {
    for (const detection of detections) {
      console.log(detection);
      context.beginPath();
      let x = detection.x * windowWidth;
      let y = detection.y * windowHeight;
      let width = detection.width * windowWidth;
      let height = detection.height * windowHeight;
      context.rect(x, y, width, height);
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.stroke();
      context.font = "28px font-family: 'Orbitron', sans-serif;";
      context.fillStyle = "red";
      context.fillText(
        detection.class.toUpperCase() +
          ": " +
          Math.round(parseFloat(detection.probability) * 100) +
          "%",
        x,
        detection.y > 0.1 ? y - 10 : y + height + 30
      );
    }
  }

  return (
    <div>
      <img id="img" 
        style={{
          position: "relative",
          borderRadius: "25px",
          width: windowSize.current[0] * STREAM_WIDTH_RATIO,
          height: windowSize.current[1] * STREAM_HEIGHT_RATIO,
        }} 
        src={RASPBERRY_PI_STREAM_ADDR} 
        alt="raspberry pi video stream">
      </img>
      {/* TODO: check if the left and top are correct */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", left: "20px", top: "20px" }}
      ></canvas>
    </div>
  );
}

function DisplayChart({ newData }) {
  const chartOptions = {
    responsive: true,
    animation: {
      duration: 200,
    },
    elements: {
      point: {
        radius: 0,
      }
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          display: false
        },
        grid: {
          display: false
        },
        min: 0,
      },
      y: {
        title: {
          display: true,
          text: "Total Number of Detections",
        },
        grid: {
          display: false
        },
        min: 0,
      }
    },
  };
 
  const [chartData, setChartData] = useState([]);
 
  useEffect(() => {
    const fetchData = () => {
      // for new anomalies per second
      // for total anomalies: just concat newData
      // setChartData(chartData.concat([newData - last]));
      setChartData(chartData.concat([newData]));
    };
 
    const intervalId = setInterval(fetchData, 1000); // update every second
 
    return () => clearInterval(intervalId);
  }, [chartData, newData]);
 
  return (
    <div >
      <Line
        options={chartOptions}
        data={{
          labels: Array.from({length: chartData.length}, (v, i) => i),
          datasets: [
            {
              data: chartData,
              tension: 0.2,
              fill: true,
              borderColor: 'rgb(52, 160, 164)',
              backgroundColor: 'rgb(155, 195, 198)',
            }
          ],
        }}
      />
    </div>
  )
}

function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [totalCount, setTotalCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [detections, setDetections] = useState([]);
  document.body.style.overflow = "hidden";
  useEffect(() => {
    const socket = io("http://localhost:65534");

    socket.on("detections", (detections) => {
      setTotalCount(totalCount + detections.length);
      setNewCount(detections.length);
      setDetections(detections);
    });

    return () => {
      socket.disconnect();
    };
  }, [totalCount]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#184E77",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: 0.1 * windowSize.current[1],
            textAlign: "center",
            fontFamily: "Orbitron",
            fontSize: 65,
            fontWeight: 900,
            color: "#D9ED92",
          }}
        >
          MechaSort
        </div>
        {/* TODO: get the logo to load */}
        <img src="../assets/mechasortLogo.png" alt="MechaSort Logo" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          backgroundColor: "#D9ED92",
          height: "100%",
        }}
      >
        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <VideoStream detections={detections} />
        </div>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
          <div
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              width: windowSize.current[0] * (1 - STREAM_WIDTH_RATIO) - 100,
            }}
          >
            <RobotArm></RobotArm>
          </div>
          <div>
          <DisplayChart newData={totalCount}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
