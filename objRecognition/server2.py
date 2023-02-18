import cv2
import numpy as np
import tensorflow as tf
import json
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin
import pandas as pd
from predict import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
cors = CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load the object detection model
model = tf.saved_model.load('./model')
predict_fn = model.signatures['serving_default']

# Initialize the video stream
# cap = cv2.VideoCapture('http://raspberry-pi-ip-address:port')
cap = cv2.VideoCapture(0)

@socketio.on_error()
def chat_error_handler(e):
    print('An error has occurred: ' + str(e))

def detect_objects():
    while True:
        # Read the next frame
        ret, frame = cap.read()
        if not ret:
            break

        # Perform object detection on the frame
        # input_tensor = tf.convert_to_tensor(frame)
        # inputs = np.array(frame, dtype=np.float32)[np.newaxis, :, :, (2, 1, 0)]  # RGB -> BGR
        # inputs = tf.convert_to_tensor(inputs)
        # outputs = predict_fn(inputs)
        
        detections = pd.DataFrame(predict_img(frame))
        # input_tensor = input_tensor[tf.newaxis, ...]
        # input_tensor = tf.cast(input_tensor, tf.float32)
        # detections = predict_fn(input_tensor)

        # print(detections.keys())
        if not detections.empty:
            boxes = detections['boundingBox']
            scores = detections['probability']
            classes = detections['tagName']

                # Filter out the detections with low confidence scores
            valid_detections = scores > 0.5

            boxes = boxes[valid_detections]
            classes = classes[valid_detections]
            if not boxes.empty:
                # Convert the bounding boxes from normalized coordinates to pixel coordinates
                print(tf.convert_to_tensor(frame).shape)
                height, width, _ = tf.convert_to_tensor(frame).shape

                boxes = np.array([list(box.values()) for box in boxes])
                print(boxes)
                # boxes = boxes.astype(np.int32)

                # Construct the list of detected objects
                detections = []
                for box, class_id in zip(boxes, classes):
                    print(box)
                    detection = {
                        'x': box[1],
                        'y': box[0],
                        'width': box[3] - box[1],
                        'height': box[2] - box[0],
                        'class': class_id
                    }
                    print(detection)
                    detections.append(detection)

                # Emit the object detection results to all connected clients over a SocketIO namespace
                with app.test_request_context('/'):
                    # emit('detections', detections, broadcast=True, namespace='/stream')
                    socketio.emit('detections', detections, broadcast=True)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Start the object detection loop in a separate thread
    import threading
    t = threading.Thread(target=detect_objects)
    t.daemon = True
    t.start()

    # Start the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=65534)
