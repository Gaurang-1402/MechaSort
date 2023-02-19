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

function DisplayChart({ c1Data, c2Data, c3Data }) {
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
                    display: false,
                    text: "Time",
                },
                ticks: {
                    display: true,
                    color: "#000000",
                    font: {
                        size: 15,
                        family: 'Inter'
                    }
                },
                grid: {
                    display: true,
                    color: "#CCCCCC"
                },
                min: 0,
            },
            y: {
                title: {
                    display: false,
                    text: "Total Number of Detections",
                },
                grid: {
                    display: true,
                    color: "#CCCCCC"
                },
                ticks: {
                    display: true,
                    color: "#000000",
                    font: {
                        size: 15,
                        family: "Inter"
                    }
                },
                min: 0,
            },
        },
    };

    const [chartData1, setChartData1] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [chartData3, setChartData3] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            // for new anomalies per second
            // for total anomalies: just concat newData
            // setChartData(chartData.concat([newData - last]));
            setChartData1(chartData1.concat([c1Data]));
            if (chartData1.length >= 10) {
                chartData1.shift();
                setChartData1(chartData1);
            }
            setChartData2(chartData2.concat([c2Data]));
            if (chartData2.length >= 10) {
                chartData2.shift();
                setChartData2(chartData2);
            }
            setChartData3(chartData3.concat([c3Data]));
            if (chartData3.length >= 10) {
                chartData3.shift();
                setChartData3(chartData3);
            }
        };

        const intervalId = setInterval(fetchData, 1000); // update every second

        return () => clearInterval(intervalId);
    }, [chartData1, chartData2, chartData3, c1Data, c2Data, c3Data]);

    return (
        <div style={{marginTop: "20px"}}>
            <Line
                options={chartOptions}
                data={{
                    labels: Array.from({ length: chartData1.length }, (v, i) => i),
                    datasets: [
                        {
                            data: chartData1,
                            tension: 0.2,
                            fill: false,
                            borderColor: '#000000',
                            // backgroundColor: 'rgb(155, 195, 198)',
                        },
                        {
                            data: chartData2,
                            tension: 0.2,
                            fill: false,
                            borderColor: '#000000',
                            // backgroundColor: 'rgb(155, 195, 198)',
                        },
                        {
                            data: chartData3,
                            tension: 0.2,
                            fill: false,
                            borderColor: '#000000',
                            // backgroundColor: 'rgb(155, 195, 198)',
                        }
                    ],
                }}
            />
        </div>
    )
}

export default DisplayChart