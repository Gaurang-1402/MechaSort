import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
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
} from "chart.js";
import "./App.css";
import DisplayChart from "./Chart.js";
import mechasortLogo from "./mechasortLogo.png";

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
    <div
      style={{
        position: "relative",
        width: windowSize.current[0] * STREAM_WIDTH_RATIO,
        height: windowSize.current[1] * STREAM_HEIGHT_RATIO,
      }}
    >
      <img
        id="img"
        style={{
          position: "absolute",
          borderRadius: "20px",
          width: windowSize.current[0] * STREAM_WIDTH_RATIO,
          height: windowSize.current[1] * STREAM_HEIGHT_RATIO,
        }}
        src={RASPBERRY_PI_STREAM_ADDR}
        alt="raspberry pi video stream"
      ></img>
      {/* TODO: check if the left and top are correct */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: windowSize.current[0] * STREAM_WIDTH_RATIO,
          height: windowSize.current[1] * STREAM_HEIGHT_RATIO,
        }}
      ></canvas>
    </div>
  );
}

function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [c1Count, setc1Count] = useState(0);
  const [c2Count, setc2Count] = useState(0);
  const [c3Count, setc3Count] = useState(0);
  const [lastClassSeen, setLastClassSeen] = useState("none")
  // const [newCount, setNewCount] = useState(0);
  const [detections, setDetections] = useState([]);
  document.body.style.overflow = "hidden";
  useEffect(() => {
    const socket = io("http://localhost:65534");

    socket.on("detections", (detections) => {
      for (var detection in detections) {
        if (detections[detection].class === "scissors") {
          if (lastClassSeen !== "scissors") {
            setc1Count(c1Count + 1);
            setLastClassSeen("scissors")
          }
        } else if (detections[detection].class === "person") {
          if (lastClassSeen !== "person") {
            setc2Count(c2Count + 1);
            setLastClassSeen("person")
           }
        } else if (detections[detection].class === "bottle") {
          if (lastClassSeen !== "bottle") {
            setc3Count(c3Count + 1);
            setLastClassSeen("bottle")
          }
        }
      // setNewCount(detections.length);
        setDetections(detections);
      }
    }
    );

    return () => {
      socket.disconnect();
    };
  }, [c1Count, c2Count, c3Count]);

  const analyticsNumberStyle = {
    backgroundColor: "#99D98C",
    fontFamily: "Orbitron",
    borderRadius: "10px",
    textAlign: "center",
    width: "60px",
    padding: "5px",
    marginTop: "10px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "1000px"
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
        <img
          src={mechasortLogo}
          height="70px"
          width="60px"
          style={{ margin: "10px" }}
          alt="MechaSort Logo"
        />
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              width: "85%",
            }}
          >
            <RobotArm></RobotArm>
          </div>
          <div
            style={{
              backgroundColor: "#34A0A4",
              width: "85%",
              // height: "80%",
              height: "250px",
              borderRadius: "25px",
              marginLeft: "20px",
              padding: "20px",
            }}
          >
            <div
              style={{ fontFamily: "Orbitron", fontWeight: 900, fontSize: 20, }}
            >
              Analytics{" "}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <div style={analyticsNumberStyle}>
                <div style={{ fontSize: 18, fontWeight: 600 }}> {c1Count} </div>
                <div style={{ fontSize: 10 }}>pieces of glass</div>
              </div>
              <div style={analyticsNumberStyle}>
                <div style={{ fontSize: 18, fontWeight: 600 }}> {c2Count} </div>
                <div style={{ fontSize: 10 }}>pieces of electronics</div>
              </div>
              <div style={analyticsNumberStyle}>
                <div style={{ fontSize: 18, fontWeight: 600 }}> {c3Count} </div>
                <div style={{ fontSize: 10 }}>pieces of toxic items</div>
              </div>
            </div>
            <div style={{width: "100%"}}>
            <DisplayChart c1Data={c1Count} c2Data={c2Count} c3Data={c3Count} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
