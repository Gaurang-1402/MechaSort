
import React, { useState } from "react";
import MyComponent from "./joint1";

function RobotArm() {
  const [joint1, setJoint1] = useState(0); // initialize state for the first joint
  const [joint2, setJoint2] = useState(0); // initialize state for the second joint
  const [joint3, setJoint3] = useState(0); // initialize state for the third joint
  const [joint4, setJoint4] = useState(0); // initialize state for the fourth joint
  const [joint5, setJoint5] = useState(0); // initialize state for the fifth joint
  const [joint6, setJoint6] = useState(0); // initialize state for the sixth joint

  // create a function to handle the movement of each joint
  function handleJointChange(event) {
    const { value, name } = event.target;
    var api = 'http://localhost:5000/api/'
    switch (name) {
      case "joint1":
        setJoint1(value);
        api += 'joint1'
        break;
      case "joint2":
        setJoint2(value);
        api += 'joint2'
        break;
      case "joint3":
        setJoint3(value);
        api += 'joint3'
        break;
      case "joint4":
        setJoint4(value);
        api += 'joint4'
        break;
      case "joint5":
        setJoint5(value);
        api += 'joint5'
        break;
      case "joint6":
        setJoint6(value);
        api += 'joint6'
        break;
      case "sleep":
        api += 'sleep'
        break;
      case "wake":
        api += 'wake'
        break;
      default:
        break;
    }
    fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // define the style for the robot arm
  const robotArmStyle = {
    position: "relative",
    width: "300px",
    height: "300px",
    border: "1px solid black",
  };

  // define the style for each segment of the robot arm
  const segmentStyle = {
    position: "absolute",
    width: "60px",
    height: "20px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "grey",
  };

  // define the style for each joint of the robot arm
  const jointStyle = {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "black",
  };


  return (
    <div style={robotArmStyle}>
      {/* <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint1}deg)` }}>
        <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
        <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint2}deg)` }}>
          <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
          <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint3}deg)` }}>
            <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
            <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint4}deg)` }}>
              <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
              <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint5}deg)` }}>
                <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
                <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint6}deg)` }}>
                  <div style={{ ...jointStyle, top: "50%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}



      {/* <div>
        <label>Joint 1:</label>
        <input type="range" min="-180" max="180" name="joint1" value={joint1} onChange={handleJointChange} />
      </div>
      <div>
        <label>Joint 2:</label>
        <input type="range" min="-180" max="180" name="joint2" value={joint2} onChange={handleJointChange} />
      </div>
      <div>
        <label>Joint 3:</label>
        <input type="range" min="-180" max="180" name="joint3" value={joint3} onChange={handleJointChange} />
      </div>
      <div>
        <label>Joint 4:</label>
        <input type="range" min="-180" max="180" name="joint4" value={joint4} onChange={handleJointChange} />
      </div>
      <div>
        <label>Joint 5:</label>
        <input type="range" min="-180" max="180" name="joint5" value={joint5} onChange={handleJointChange} />
      </div>
      <div>
        <label>Joint 6:</label>
        <input type="range" min="-180" max="180" name="joint6" value={joint6} onChange={handleJointChange} />
      </div>
      <div>
        <label>Sleep:</label>
        <input type="range" min="-180" max="180" name="sleep" value={joint6} onChange={handleJointChange} />
      </div>
      <div>
        <label>Wake up:</label>
        <input type="range" min="-180" max="180" name="wake" value={joint6} onChange={handleJointChange} />
      </div> */}
      <MyComponent />
    </div >

  )
}

export default RobotArm;
// import React, { useState } from "react";

// function RobotArm() {
//   // State variables for joint angles
//   const [joint1, setJoint1] = useState(0);
//   const [joint2, setJoint2] = useState(0);
//   const [joint3, setJoint3] = useState(0);
//   const [joint4, setJoint4] = useState(0);
//   const [joint5, setJoint5] = useState(0);
//   const [joint6, setJoint6] = useState(0);

//   // Function to handle joint angle changes
//   const handleJointChange = (event) => {
//     const value = parseInt(event.target.value);
//     const name = event.target.name;
//     switch (name) {
//       case "joint1":
//         setJoint1(value);
//         break;
//       case "joint2":
//         setJoint2(value);
//         break;
//       case "joint3":
//         setJoint3(value);
//         break;
//       case "joint4":
//         setJoint4(value);
//         break;
//       case "joint5":
//         setJoint5(value);
//         break;
//       case "joint6":
//         setJoint6(value);
//         break;
//       default:
//         break;
//     }
//   };

//   // Style objects for segments and joints
//   const baseStyle = {
//     position: "absolute",
//     width: "100px",
//     height: "100px",
//     borderRadius: "50%",
//     backgroundColor: "#777",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "column",
//   };

//   const segmentStyle = {
//     position: "absolute",
//     width: "50px",
//     height: "200px",
//     backgroundColor: "#aaa",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     transformOrigin: "top",
//   };

//   const jointStyle = {
//     position: "absolute",
//     width: "20px",
//     height: "20px",
//     borderRadius: "50%",
//     backgroundColor: "#999",
//   };

//   // JSX for robot arm
//   return (
//     <div>
//       <div style={baseStyle}>
//         <div style={{ ...jointStyle }}></div>
//         <div style={{ ...segmentStyle, transform: `rotate(${joint1}deg)` }}>
//           <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//           <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint2}deg)` }}>
//             <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//             <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint3}deg)` }}>
//               <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//               <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint4}deg)` }}>
//                 <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//                 <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint5}deg)` }}>
//                   <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//                   <div style={{ ...segmentStyle, transform: `translateY(-100%) rotate(${joint6}deg)` }}>
//                     <div style={{ ...jointStyle, top: "0%", left: "0%", transform: "translate(-50%, -50%)" }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <label htmlFor="joint1">Joint 1:</label>
//         <input
//           type="range"
//           name="joint1"
//           value={joint1}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="joint2">Joint 2:</label>
//         <input
//           type="range"
//           name="joint2"
//           value={joint2}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="joint3">Joint 3:</label>
//         <input
//           type="range"
//           name="joint3"
//           value={joint3}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="joint4">Joint 4:</label>
//         <input
//           type="range"
//           name="joint4"
//           value={joint4}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="joint5">Joint 5:</label>
//         <input
//           type="range"
//           name="joint5"
//           value={joint5}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//       <div>
//         <label htmlFor="joint6">Joint 6:</label>
//         <input
//           type="range"
//           name="joint6"
//           value={joint6}
//           min={-180}
//           max={180}
//           step={1}
//           onChange={handleJointChange}
//         />
//       </div>
//     </div>
//   );
// }

// export default RobotArm;

