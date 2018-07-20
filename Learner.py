import os
import random
import json
from flask import Flask, render_template
from flask_socketio import SocketIO,emit
ASSETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=ASSETS_DIR, static_folder=ASSETS_DIR,static_url_path=ASSETS_DIR)
app.config['SECRET_KEY'] = 'secret!'
ACTIONS = ["Up","Down","Left","Right","Attack","AttackQuit"]

socketio = SocketIO(app)
frame = 1
def randomAction():
    global frame,ACTIONINFO
    r1 = random.randint(0,5)
    r2 = random.randint(0,5)
    heroInput = {} 
    sorcererInput = {}
    for i,A in enumerate(ACTIONS):
        if i == r1:
            heroInput.update({A:True})
        else:
            heroInput.update({A:False})
        
        if i == r2:
            sorcererInput.update({A:True}) 
        else:
            sorcererInput.update({A:False})

    ActionInfo = {"frame":frame,"heroInput":heroInput ,"sorcererInput":sorcererInput}
    frame += 1
    return ActionInfo



@app.route('/')
def index():
    return render_template('index.html')
@socketio.on('state')
def getState(message):
    print("state: ",message)
    emit("Action",randomAction())

@socketio.on('start')
def startSign(message):
    emit("Action",randomAction())
if __name__ == '__main__':
    socketio.run(app)


