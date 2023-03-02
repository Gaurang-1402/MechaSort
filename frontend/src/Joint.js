import React, { useState } from "react";

const offset = 54
let anglesGlobal = [0, 0, 0]

function jointApiCalls(angles) {
  var api = 'http://localhost:5000/api/combined_mouse'
  fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(anglesGlobal)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function ArmModel({ top, left }) {
  const [impts, setImpts] = useState([top, top - offset, top - (offset * 2), top - (offset * 3)]);
  const [impls, setImpls] = useState([left, left, left, left]);
  const [angles, setAngles] = useState([0, 0, 0]);

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
    jointApiCalls(angles);
  }

  function handleMouseMove(e) {
    const { clientX } = e;
    // console.log(clientX);
    const direction = clientX > 1600;
    // var newAngles = [...angles];
    if (curMouseIndex > 0) {
      // console.log("here", curMouseIndex, angles[curMouseIndex - 1], direction)
      // newAngles[curMouseIndex-1] = angles[curMouseIndex - 1] + 5 * direction;
      // setAngles(newAngles);
      setAngles(prevAngles => {
        anglesGlobal = prevAngles
        const newAngles = { ...prevAngles };
        newAngles[curMouseIndex - 1] = prevAngles[curMouseIndex - 1] + 0.2 * direction - 0.1;
        renderPositions(newAngles);
        return newAngles;
      });
      // renderPositions(angles);
    }
    // console.log(angle);
  }

  const renderPositions = (angles) => {
    var impts = [top, top - offset, top - (offset * 2), top - (offset * 3)];
    var impls = [left, left, left, left];
    var angle = 0;
    for (var i = 0; i < 3; i++) {
      angle += angles[i];
      impts[i + 1] = impts[i] - offset * Math.cos((angle * Math.PI) / 180);
      impls[i + 1] = impls[i] + offset * Math.sin((angle * Math.PI) / 180);
    }
    setImpts(impts);
    setImpls(impls);
  }

  const jointMouseDown = (event) => {
    event.preventDefault();
  }

  const cummulativeAngles = [0, angles[0], angles[0] + angles[1], angles[0] + angles[1] + angles[2]];
  return (
    <div>
      {impts.map((impt, index) => (
        <div>
          {/* bars */}
          <img
            alt="bar"
            key={"bar" + index}
            src={require("./bar" + index + ".png")}
            onMouseDown={(event) => handleMouseDown(event, index)}
            style={{
              position: 'absolute',
              width: index === 0 ? "80px" : index === 1 ? "25px" : index === 2 ? "25px" : "20px",
              height: index === 0 ? "30px" : index === 1 ? "40px" : index === 2 ? "50px" : "20px",
              top: `${impt - (index === 2 ? 15 : 0)}px`,
              left: `${impls[index] + (index === 1 || index === 2 || index === 3 ? 25 : 0)}px`,
              transform: `rotate(${cummulativeAngles[index]}deg)`,
              transformOrigin: "50% 95%",
            }}
          />
        </div>
      ))}
      {impts.map((impt, index) => (
        <div>
          {/* joints */}
          <img
            alt="joint"
            key={"joint" + index}
            src={require("./joint" + index + ".png")}
            onMouseDown={(event) => jointMouseDown(event)}
            style={{
              position: 'absolute',
              width: index === 3 ? "45px" : "25px",
              height: index === 3 ? "45px" : "25px",
              top: `${impts[index] - 20 - (index === 2 ? 15 : index === 3 ? 25 : 0)}px`,
              left: `${(impls[index + (index === 3 ? 0 : 1)] + impls[index]) / 2 + 25 - (index === 3 ? 10 : 0)}px`,
              transform: `rotate(${cummulativeAngles[index]}deg)`,
              transformOrigin: "50% 95%",
            }}
          />
        </div>
      ))}

      {/* joints */}

      {/* <form>
        <label htmlFor="top">Joint1:</label>
        <input type="text" name="joint1" value={angles[0]} onChange={handleAngleChange} />
        <label htmlFor="left">Joint2:</label>
        <input type="text" name="joint2" value={angles[1]} onChange={handleAngleChange} />
        <label htmlFor="rotate">Joint3:</label>
        <input type="text" name="joint3" value={angles[2]} onChange={handleAngleChange} />
      </form> */}
    </div>
  );
};

export default ArmModel;