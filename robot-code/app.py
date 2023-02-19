from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)
last_time = time.monotonic()
import xarm

arm = xarm.Controller('USB')

servo1 = xarm.Servo(1)
servo2 = xarm.Servo(2)
servo3 = xarm.Servo(3)
servo4 = xarm.Servo(4)
servo5 = xarm.Servo(5)
servo6 = xarm.Servo(6)

def move_joint(joint, position):
    global last_time
    cur_time = time.monotonic()
    if cur_time - last_time > 5.0:
        print("here", cur_time - last_time)
        last_time = cur_time
        arm.setPosition(joint, position, 2000, wait=True)
        
def move_joint_multiple(joints, positions):
    global last_time
    print("moving multiple", joints, positions)
    cur_time = time.monotonic()
    if cur_time - last_time > 5.0:
        print("here", cur_time - last_time)
        last_time = cur_time
        for ind in range(len(joints) - 1):
            arm.setPosition(joints[ind], positions[ind], 2000, wait=False)
        ind = len(joints) - 1
        arm.setPosition(joints[ind], positions[ind], 2000, wait=False)    
        

@app.route('/api/combined_mouse', methods=['POST'])
def move_combined_mouse():
    move_jointw();
    # print("we are here")
    # data = request.get_json()
    # print(data)
    # move_joint_multiple([2, 3, 4], [int(data['0'])*10 + 500, int(data['1'])*10 + 500, int(data['2'])*10 + 500])
    return jsonify("Done"), 201

@app.route('/api/joint1', methods=['POST'])
def move_joint1():
    data = request.get_json()
    move_joint(1, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/joint2', methods=['POST'])
def move_joint2():
    data = request.get_json()
    move_joint(2, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/joint3', methods=['POST'])
def move_joint3():
    data = request.get_json()
    move_joint(3, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/joint4', methods=['POST'])
def move_joint4():
    data = request.get_json()
    move_joint(4, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/joint5', methods=['POST'])
def move_joint5():
    data = request.get_json()
    move_joint(5, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/joint6', methods=['POST'])
def move_joint6():
    data = request.get_json()
    move_joint(6, int(data) + 500)
    return jsonify("Done"), 201

@app.route('/api/wake', methods=['POST'])
def move_jointw():
    data = request.get_json()
    arm.setPosition(1, 500, 2000, wait=False)
    arm.setPosition(2, 500, 2000, wait=False)
    arm.setPosition(3, 500, 2000, wait=False)
    arm.setPosition(4, 500, 2000, wait=False)
    arm.setPosition(5, 500, 2000, wait=False)
    arm.setPosition(6, 500, 2000, wait=True)
    return jsonify("Done"), 201

@app.route('/api/sleep', methods=['POST'])
def move_joints():
    data = request.get_json()
    arm.setPosition(1, 400, 2000, wait=False)
    arm.setPosition(2, 400, 2000, wait=False)
    arm.setPosition(3, 400, 2000, wait=False)
    arm.setPosition(4, 400, 2000, wait=False)
    arm.setPosition(5, 400, 2000, wait=False)
    arm.setPosition(6, 400, 2000, wait=True)
    return jsonify("Done"), 201


if __name__ == '__main__':
    app.run(debug=True)
