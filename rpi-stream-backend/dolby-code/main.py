import dolbyio
import subprocess
from flask import Flask, render_template
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

api_key = config.get('dolby', 'api_key')
api_secret = config.get('dolby', 'api_secret')
client_token = config.get('dolby', 'client_token')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', api_key=api_key, api_secret=api_secret, stream_id=client_token)

if __name__ == '__main__':
    app.run(debug=True)


# Set up the Dolby.io client
client = dolbyio.Client(api_key, api_secret)

# Set up the FFMPEG command to capture and encode the video
ffmpeg_cmd = ['ffmpeg', '-f', 'video4linux2', '-i', '/dev/video0', '-f', 'mpegts', '-codec:v', 'mpeg1video', '-s', '640x480', '-b:v', '800k', '-r', '30', '-']

# Start the FFMPEG process and pipe the output to Dolby.io's video streaming API
ffmpeg_process = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE)
client.post('/media/live-streaming/stream', data=ffmpeg_process.stdout)

print('Streaming started.')
