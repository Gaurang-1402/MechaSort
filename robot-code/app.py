from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

import xarm
# arm = xarm.Controller('USB')

last_time = time.monotonic()
time_diff_allowed = 3.0

standard_move_time = 2000


def setPositionWrapper(joint, angle, wait):
    if joint == 3:
        print("Skipping joint 3 movement to avoid AI detected collision")
    print("move joint", joint, "to angle", angle);
    # arm.setPosition(joint, angle, standard_move_time, wait)

def spaced_move_joint(joint, position):
    global last_time
    cur_time = time.monotonic()
    if cur_time - last_time > time_diff_allowed:
        last_time = cur_time
        setPositionWrapper(joint, position, wait=True)

def spaced_move_joints_4_5(angle_4, angle_5):
    print("double_move", angle_4, angle_5)
    global last_time
    cur_time = time.monotonic()
    if cur_time - last_time > time_diff_allowed:
        last_time = cur_time
        setPositionWrapper(4, angle_4, wait=False)
        setPositionWrapper(5, angle_5, wait=True)    


def normalize_angle(data):
    # The range for data is [-180, 180]
    # Scaling it to [-360, 360]
    # Adding 500 since accepted values in [0, 1000]
    # Avoiding extremes for safety
    data = int(data)
    data = max(-180, min(180, data)) # Clip in [-180,180] as a safeguard
    return 500 + 2 * data

def move_joint_helper(data, joint):
    print("move", data, joint)
    spaced_move_joint(joint, normalize_angle(data), wait=True)
    return jsonify("Done"), 201

######################## API Receivers ########################

@app.route('/api/joint0', methods=['POST'])
def move_joint0():
    return move_joint_helper(request.get_json(), 1)

@app.route('/api/joint1', methods=['POST'])
def move_joint1():
    return move_joint_helper(request.get_json(), 2)

@app.route('/api/joint5', methods=['POST'])
def move_joint5():
    return move_joint_helper(request.get_json(), 6)

@app.route('/api/wake', methods=['POST'])
def move_jointw():
    setPositionWrapper(1, 500, wait=False)
    setPositionWrapper(2, 500, wait=False)
    # DO NOT UNCOMMENT: setPositionWrapper(3, 500, wait=False)
    setPositionWrapper(4, 500, wait=False)
    setPositionWrapper(5, 500, wait=False)
    setPositionWrapper(6, 500, wait=True)
    return jsonify("Done"), 201

@app.route('/api/sleep', methods=['POST'])
def move_joints():
    setPositionWrapper(1, 500, wait=False)
    setPositionWrapper(2, 500, wait=False)
    # DO NOT UNCOMMENT: setPositionWrapper(3, 500, wait=False)
    setPositionWrapper(4, 100, wait=False)
    setPositionWrapper(5, 500, wait=False)
    setPositionWrapper(6, 500, wait=True)
    return jsonify("Done"), 201

@app.route('/api/combined_mouse', methods=['POST'])
def move_combined_mouse():
    data = request.get_json()
    spaced_move_joints_4_5(normalize_angle(data['1']), normalize_angle(data['2']))
    return jsonify("Done"), 201

if __name__ == '__main__':
    app.run(debug=True)
