# -*- coding: utf-8 -*-
"""
@author: Nam Yunwoo 
"""
import random
import time
from RuleBasedAction import ruleBasedAction
ACTIONS = ["Up","Down","Left","Right","Attack"]
actionHero,actionsorcerer = 'Up','Up'
baseActionHero = {"Up":False,"Down":False,"Left":False,"Right":False,"Attack":False}
baseActionSorcerer = {"Up":False,"Down":False,"Left":False,"Right":False,"Attack":False}
FRAME = 0
def frame():
    global FRAME
    FRAME += 1
    if FRAME % 1000000 == 0:
        FRAME = 1
    return FRAME


def ruleAction(envInfo):
    '{"hero":heroAction,"sorcerer":""}'
    global actionHero,actionsorcerer
    baseActionHero[actionHero] = False
    baseActionSorcerer[actionsorcerer] = False    
    action = ruleBasedAction(envInfo)
    actionHero = action['hero']
    actionsorcerer = action['sorcerer']
    baseActionHero[actionHero] = True
    baseActionSorcerer[actionsorcerer] = True
    return {"frame":frame(),"heroInput":baseActionHero,"sorcererInput":baseActionSorcerer}
    
        
def randomAction():
    global ACTIONINFO
    r1 = random.randint(0,4)
    r2 = random.randint(0,4)
    #r1,r2 = 4,4
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

    ActionInfo = {"heroInput":heroInput ,"sorcererInput":sorcererInput}
    #frame += 1
    return ActionInfo


def rewardSystem(envInfo):
    """
        design your reward Sys
    """
    return 0,0

def stateSystem(envInfo):
    """
        design your state Sys
    """
    return [],[]

def getAgentsAction(r1s1,r2s2):
    """
        design your Action Sys
    """

    a1,a2 =  {"Up":True,"Down":False,"Left":False,"Right":False,"Attack":False},{"Up":True,"Down":False,"Left":False,"Right":False,"Attack":False}
    return a1,a2

def action(envInfo):
    """
    0. Description:

        1. Input: envInfo about two agents
            - Dataformat i.e: 
                    {
                     'hero': 
                            {
                             'animIdx': 1, 
                             'animKey': 'hero_up', 
                             'x': 28.49953198488525, 
                             'y': 169.99999955744386, 
                             'direction': 4,
                             'HP':80
                             }, 
                     'sorcerer': 
                            {
                             'animIdx': 1, 
                             'animKey': 'sorcerer_up', 
                             'x': 503.3330993257755, 
                             'y': 513.333569553671, 
                             'direction': 4
                             'HP':60
                             }
                     'potion':
                            {
                             'x': 101.1,
                             'y': 101.1
                            }
                    }

            hero: agent1 name
            sorcerer: agent2 name
            animIdx: index of current animation frame
            animKey: explain of current animation
            x: agent x location
            y: agent y location
            HP: Health Point
            direction: agent's front direction (1:down, 2:left, 3:right: 4:up)
            potion: potion name and locations

        2. Output: Actions for two agents
            - Dataformat i.e:
                            {
                            "frame": 0,
                            "heroInput":
                                        {
                                        'Up': True,
                                        'Down': False,
                                        'Left': False,
                                        'Right': False,
                                        'Attack': False
                                        },
                            "sorcererInput":
                                        {

                                        'Up': True,
                                        'Down': False,
                                        'Left': False,
                                        'Right': False,
                                        'Attack': False
                                        }
                            }
            

    """
    print(envInfo)

    r1,r2 = rewardSystem(envInfo)
    s1,s2 = stateSystem(envInfo)
    a1,a2 = getAgentsAction((r1,s1),(r2,s2))
    return {"frame":frame(),"heroInput":a1,"sorcererInput":a2}