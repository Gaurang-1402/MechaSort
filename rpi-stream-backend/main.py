# * This web application serves a motion JPEG stream

from flask import Flask, render_template, Response, request, send_from_directory
from camera import VideoCamera
import os

pi_camera = VideoCamera(flip=False) # ! flip pi camera if upside down.

# App 
app = Flask(__name__)

def gen(camera):
    #get camera frame
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(pi_camera),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Take a photo when pressing camera button
@app.route('/picture')
def take_picture():
    pi_camera.take_picture()
    return "None"

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)