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
                    labels: Array.from({ length: chartData.length }, (v, i) => i),
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

export default DisplayChart