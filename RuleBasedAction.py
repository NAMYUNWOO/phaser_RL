
import time
import numpy as np
heroFacing,sorcererFacing = "Up","Up"
lastAction  =  {"hero":"Attack",'sorcerer':"Attack"}
timeNow = time.time()
def checkHealth(heroHP,sorcererHP):
    heroHPLow = (heroHP < 30)
    sorcererHPLow = (sorcererHP < 30)
    return heroHPLow,sorcererHPLow

def ruleBasedAction(envInfo):
    global heroFacing,sorcererFacing,lastAction,timeNow
    try:
        hp1 = envInfo['hero']['HP']
        hp2=  envInfo['sorcerer']['HP']
        heroX, heroY = envInfo['hero']['x'], envInfo['hero']['y']
        sorcererX, sorcererY = envInfo['sorcerer']['x'],envInfo['sorcerer']['y']
        potionX, potionY = envInfo['potion']['x'],envInfo['potion']['y']
        heroHPLow,sorcererHPLow = checkHealth(hp1,hp2)
    except Exception as err:
        return lastAction
    timeCand = time.time()
    if (timeCand - timeNow) < 0.1:
        return lastAction
    print(envInfo)
    #HeroAction
    if heroHPLow:
        xDist,yDist = ( heroX - potionX ,heroY - potionY) 
        if abs(xDist) > abs(yDist): #np.random.choice([True,False]): #
            if xDist > 0.:
                heroAction = "Left"
            else:
                heroAction = "Right"
        else:
            if yDist > 0.:
                heroAction = "Up"
            else:
                heroAction = "Down"            


    else:
        xDist,yDist = (heroX - sorcererX,
                       heroY - sorcererY)
        xDistAbs,yDistAbs = abs(xDist), abs(yDist)
        #print(xDistAbs + yDistAbs)
        if (xDistAbs + yDistAbs) < 30.:
            if xDistAbs > yDistAbs:
                if xDist > 0.:
                    if heroFacing == 'Left':
                        heroAction = "Attack"
                    else:
                        heroAction = "Left"
                else:
                    if heroFacing == 'Right':
                        heroAction = "Attack"
                    else:
                        heroAction = "Right"
            else:
                if yDist > 0.:
                    if heroFacing == 'Up':
                        heroAction = "Attack"
                    else:
                        heroAction = "Up"
                else:
                    if heroFacing == 'Down':
                        heroAction = "Attack"
                    else:
                        heroAction = "Down"

        elif xDistAbs > yDistAbs:
            if xDist > 0.:
                heroAction = "Left"
            else:
                heroAction = "Right"
        else:
            if yDist > 0.:
                heroAction = "Up"
            else:
                heroAction = "Down"     
    
    if  heroAction != "Attack":
        heroFacing = heroAction
    #SorcererAction
    #...
    lastAction = {"hero":heroAction,'sorcerer':"Attack"}
    timeNow = timeCand
    return lastAction


