# The steps implemented in the object detection sample code: 
# 1. for an image of width and height being (w, h) pixels, resize image to (w', h'), where w/h = w'/h' and w' x h' = 262144
# 2. resize network input size to (w', h')
# 3. pass the image to network and do inference
# (4. if inference speed is too slow for you, try to make w' x h' smaller, which is defined with DEFAULT_INPUT_SIZE (in object_detection.py or ObjectDetection.cs))
"""Sample prediction script for TensorFlow SavedModel"""
import os
import sys
import tensorflow as tf
import numpy as np
from PIL import Image
from object_detection import ObjectDetection

MODEL_FILENAME = 'saved_model.pb'
LABELS_FILENAME = 'labels.txt'


class TFObjectDetection(ObjectDetection):
    """Object Detection class for TensorFlow SavedModel"""

    def __init__(self, model_filename, labels):
        super(TFObjectDetection, self).__init__(labels)
        model = tf.saved_model.load(os.path.dirname(model_filename))
        self.serve = model.signatures['serving_default']

    def predict(self, preprocessed_image):
        inputs = np.array(preprocessed_image, dtype=np.float32)[np.newaxis, :, :, (2, 1, 0)]  # RGB -> BGR
        inputs = tf.convert_to_tensor(inputs)
        outputs = self.serve(inputs)
        return np.array(outputs['outputs'][0])


def main(image_filename):
    # Load labels
    with open(LABELS_FILENAME, 'r') as f:
        labels = [label.strip() for label in f.readlines()]

    od_model = TFObjectDetection(MODEL_FILENAME, labels)

    image = Image.open(image_filename)
    predictions = od_model.predict_image(image)
    print(predictions)


if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('USAGE: {} image_filename'.format(sys.argv[0]))
    else:
        main(sys.argv[1])
