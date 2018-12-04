# -*- coding: utf-8 -*-
"""
@author: Nam Yunwoo 
"""
import os
import json
from Action import action,randomAction
from flask import Flask, render_template
from flask_socketio import SocketIO,emit
import re
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
if not ASSETS_DIR.startswith("/"):
    ASSETS_DIR = ASSETS_DIR[2:]
    ASSETS_DIR = re.sub(pattern= "\\\\",repl ="/",string =ASSETS_DIR)
print("starting server at http://localhost:5000")
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR,static_url_path=ASSETS_DIR)
app.config['SECRET_KEY'] = 'secret!'


socketio = SocketIO(app)



@app.route('/')
def index():
    return render_template('index.html')
@socketio.on('state')
def getState(envInfo):
    emit("Action",randomAction())
    #emit("Action",action(envInfo))

@socketio.on('start')
def startSign(message):
    emit("Action",randomAction())
if __name__ == '__main__':
    socketio.run(app)


