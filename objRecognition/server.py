import cv2
import numpy as np
import tensorflow as tf
from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import pandas as pd
from predict import *

app = Flask(__name__)
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
        
        detections = pd.DataFrame(predict_img(frame))

        if not detections.empty:
            boxes = detections['boundingBox']
            scores = detections['probability']
            classes = detections['tagName']

            # Filter out the detections with low confidence scores
            valid_detections = scores > 0.1

            boxes = boxes[valid_detections]
            classes = classes[valid_detections]
            scores = scores[valid_detections]

            if not boxes.empty:
                boxes = np.array([list(box.values()) for box in boxes])

                # Construct the list of detected objects
                detections = []
                for box, class_id, prob in zip(boxes, classes, scores):
                    detection = {
                        'x': box[0],
                        'y': box[1],
                        'width': box[2],
                        'height': box[3],
                        'class': class_id,
                        'probability': prob
                    }

                    detections.append(detection)                

                # Emit the object detection results to all connected clients over a SocketIO namespace
                with app.test_request_context('/'):
                    socketio.emit('detections', detections, broadcast=True)


if __name__ == '__main__':
    # Start the object detection loop in a separate thread
    import threading
    t = threading.Thread(target=detect_objects)
    t.daemon = True
    t.start()

    # Start the Flask-SocketIO server
    socketio.run(app, host='0.0.0.0', port=65534)
