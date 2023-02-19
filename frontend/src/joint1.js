import React, { useState } from "react";

const MyComponent = () => {
  const [impts, setImpts] = useState([500, 410, 320, 230]);
  const [impls, setImpls] = useState([500, 500, 500, 500]);
  const [angles, setAngles] = useState([0, 0, 0]);
  // const [isDragging, setIsDragging] = useState(false);
  const angleNames = ["joint1", "joint2", "joint3"];
  var curMouseIndex = -1;

  function handleMouseDown(event, index) {
    event.preventDefault();
    console.log("mouse down " + index.toString());
    curMouseIndex = index;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
  function handleMouseUp() {
    console.log("mouse up");
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e) {
    const {clientX, clientY} = e;
    const angle = (Math.atan2(clientY - impts[curMouseIndex] - 45, clientX - impls[curMouseIndex] - 45) * 180) / Math.PI;
    var newAngles = [...angles];
    if (curMouseIndex > 0) {
      newAngles[curMouseIndex-1] = angle;
      setAngles(newAngles);
      renderPositions(newAngles);
    }
    console.log(angle);
  }
  
  const renderPositions = (angles) => {
    var impts = [500, 410, 320, 230];
    var impls = [500, 500, 500, 500];
    var angle = 0;
    for (var i = 0; i < 3; i++) {
      angle += angles[i];
      impts[i + 1] = impts[i] - 90 * Math.cos((angle * Math.PI) / 180);
      impls[i + 1] = impls[i] + 90 * Math.sin((angle * Math.PI) / 180);
    }
    setImpts(impts);
    setImpls(impls);
  }
  
  const handleAngleChange = (event) => {
    const { name, value } = event.target;
    var newAngles = [...angles];
    if (value == "") {
      return;
    }
    const intValue = parseInt(value);
    if (name == angleNames[0]) {
      newAngles[0] = intValue;
    } else if (name == angleNames[1]) {
      newAngles[1] = intValue;
    } else if (name == angleNames[2]) {
      newAngles[2] = intValue;
    }
    setAngles(newAngles);
    renderPositions(newAngles);
  }

  const cummulativeAngles = [0, angles[0], angles[0] + angles[1], angles[0] + angles[1] + angles[2]];
  return (
    <div>
      <h1>My Component</h1>
      {impts.map((impt, index) => (
        <img
          key={index}
          src={require("./lol.png")}
          onMouseDown={(event) => handleMouseDown(event, index)}
          style={{
            position: 'absolute',
            width: "100px",
            height: "100px",
            top: `${impt}px`,
            left: `${impls[index]}px`,
            transform: `rotate(${cummulativeAngles[index]}deg)`,
            transformOrigin: "50% 95%",
          }}
        />
      ))}
      <form>
        <label htmlFor="top">Joint1:</label>
        <input type="text" name="joint1" value={angles[0]} onChange={handleAngleChange} />
        <label htmlFor="left">Joint2:</label>
        <input type="text" name="joint2" value={angles[1]} onChange={handleAngleChange} />
        <label htmlFor="rotate">Joint3:</label>
        <input type="text" name="joint3" value={angles[2]} onChange={handleAngleChange} />
      </form>
    </div>
  );
};

export default MyComponent;