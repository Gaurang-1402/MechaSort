import React, { useState } from "react";
import ArmModel from "./Joint.js"

import "./App.css"

function RobotArm() {
  const [joint1, setJoint1] = useState(0); // initialize state for the first joint
  const [joint2, setJoint2] = useState(0); // initialize state for the second joint
  const [joint3, setJoint3] = useState(0); // initialize state for the third joint

  // create a function to handle the movement of each joint
  function handleJointChange(event) {
    const { value, name } = event.target;
    var api = "http://localhost:5000/api/";
    switch (name) {
      case "joint0":
        setJoint1(value);
        break;
      case "joint1":
        setJoint2(value);
        break;
      case "joint5":
        setJoint3(value);
        break;
      case "sleep":
      case "wake":
        break;
      default: // Unexpected name
        console.warn("Expected name " + name);
        break;
    }
    api += name;
    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const sliderHolderStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: "space-between", 
    marginTop: 10,
    marginBottom: 10,
    width: "100%"
  };

  // define the style for the robot arm
  const robotArmStyle = {
    position: "relative",
    width: "100%",
    // height: "100%",
    height: "350px",
    backgroundColor: "#34A0A4",
    borderRadius: "25px",
    paddingTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px"
  };

  const robotButtonStyle = {
    border: "none",
    backgroundColor: "#76C893",
    borderRadius: "10px",
    fontFamily: "Orbitron",
    fontWeight: 600,
    fontSize: 15,
    padding: "10px",
    // margin: "10px",
    marginTop: "100px",
    marginLeft: "10px",
    marginRight: "10px"
  };

  return (
    <div style={{paddingBottom: "10px"}}>
      <div style={robotArmStyle}>
        <div style={{ fontFamily: "Orbitron", fontWeight: 900, fontSize: 20, marginBottom: 20 }}>
          Robot Control
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center" }}>
          <div style={{width:"100%"}}>
            <div style={sliderHolderStyle}>
              <div >Hand: {joint1}</div>
              <input
                type="range"
                min="-180"
                max="180"
                name="joint0"
                value={joint1}
                onChange={handleJointChange}
              />
            </div>
            <div style={sliderHolderStyle}>
              <div >Wrist: {joint2}</div>
              <input
                type="range"
                min="-180"
                max="180"
                name="joint1"
                value={joint2}
                onChange={handleJointChange}
              />
            </div>
            <div style={sliderHolderStyle}>
              <div >Base: {joint3}</div>
              <input
                type="range"
                min="-180"
                max="180"
                name="joint5"
                value={joint3}
                onChange={handleJointChange}
              />
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <ArmModel top={260} left={150} />
          </div>
        </div>
        <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <button style={robotButtonStyle} name="wake" onClick={handleJointChange}>Wake</button>
        <button style={robotButtonStyle} name="sleep" onClick={handleJointChange}>Sleep</button>
      </div>
      </div>
    </div>
  );
}

export default RobotArm;
