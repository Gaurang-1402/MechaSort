import cv2
import numpy as np
import tensorflow as tf
import json
import asyncio
import websockets
import socket

# Load the object detection model
model = tf.saved_model.load('./model')

# Initialize the video stream
# cap = cv2.VideoCapture('http://raspberry-pi-ip-address:port')
# print(socket.gethostbyname(hostname))
cap = cv2.VideoCapture(0)

async def detect_objects(websocket, path):
    while True:
        # Read the next frame
        ret, frame = cap.read()
        if not ret:
            break

        # Perform object detection on the frame
        input_tensor = tf.convert_to_tensor(frame)
        input_tensor = input_tensor[tf.newaxis, ...]
        print(input_tensor)
        print(model)
        detections = model(input_tensor)

        # Extract the bounding boxes and class labels from the detection results
        boxes = detections['detection_boxes'][0].numpy()
        scores = detections['detection_scores'][0].numpy()
        classes = detections['detection_classes'][0].numpy().astype(np.int32)

        # Filter out the detections with low confidence scores
        valid_detections = scores > 0.5
        print(valid_detections)
        boxes = boxes[valid_detections]
        classes = classes[valid_detections]

        # Convert the bounding boxes from normalized coordinates to pixel coordinates
        height, width, _ = frame.shape
        boxes = boxes * np.array([height, width, height, width])
        boxes = boxes.astype(np.int32)

        # Construct the list of detected objects
        detections = []
        for box, class_id in zip(boxes, classes):
            detection = {
                'x': box[1],
                'y': box[0],
                'width': box[3] - box[1],
                'height': box[2] - box[0],
                'class': class_id
            }
            detections.append(detection)

        # Send the object detection results to the client over a WebSocket
        await websocket.send("hello")
        # await websocket.send(json.dumps(detections))

async def server():
    print(socket.gethostbyname(socket.gethostname()))
    async with websockets.serve(detect_objects, "0.0.0.0", 65534):
        await asyncio.Future()  # run forever

if __name__ == '__main__':
    asyncio.run(server())
