# Reinforcement-Learning implementation on PhaserJS

## Dependencies
1. Flask
2. flask-socketio
3. your own Neural-Network library (if needed)
<br><br>
## Big Picture
![explain](./img/phaser_js_RL_ex.jpg)
<br><br>
## How to Run
    $ python ./Learner.py
    $ to test game, use https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb and set folder with /templates_test

<br><br>

## How to train
1. open Action.py 
2. maniplulate **action function** with your own RL algorithm
3. regarding **action function** you receive reward and state and should return action
<br><br>

## Environment

## Reinforcement-Learning
### MDP
![MDP](https://latex.codecogs.com/svg.latex?V^\pi(s)=R(s)+\gamma\sum_{s^\prime\in{S}}P_{s\pi(s)}(s^\prime)V^\pi(s^\prime))
