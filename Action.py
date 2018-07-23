import random
import time
ACTIONS = ["Up","Down","Left","Right","Attack"]
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



def action(rewardStateMessage):
    """
        Input: reward and State of two agents
            - Dataformat i.e: 
                    {
                     'hero': 
                            {
                             'animIdx': 1, 
                             'animKey': 'hero_up', 
                             'x': 28.49953198488525, 
                             'y': 169.99999955744386, 
                             'direction': 4
                             }, 
                     'sorcerer': 
                            {
                             'animIdx': 1, 
                             'animKey': 'sorcerer_up', 
                             'x': 503.3330993257755, 
                             'y': 513.333569553671, 
                             'direction': 4
                             }
                    }

            hero: agent1 name
            sorcerer: agent2 name
            animIdx: index of current animation frame
            animKey: explain of current animation
            x: agent x location
            y: agent y location
            direction: agent's front direction (1:down, 2:left, 3:right: 4:up)


        Output: Actions of tow agents
            - Dataformat i.e:
                            {
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
    print(rewardStateMessage)
    return randomAction() 