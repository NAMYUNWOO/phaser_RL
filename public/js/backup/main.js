var config = {
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false 
    }
  },
  scene: {
    key: 'main',
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  }
};
let game = new Phaser.Game(config);
//let gameScene = new Phaser.Scene("Game");
// load asset files for our game

function init() {
  this.playerSpeed = 2.0;
  this.moveVal = 200;
  this.enemyMaxY = 960;
  this.enemyMaxX = 960;
  this.tileSize = 48;
  this.bodySizeX = 17;
  this.bodySizeY = 10;
  this.bodyOffsetX = 17;
  this.bodyOffsetY = 83;
  this.bodyOffsetXAnim = 67;
}

var characInfos = {};
var characs = {};
var myInput = {};
var sorcererInput = {};
var heroInput = {};
var characStatus  = {};
var cursors;
var map;
var baseLayer;
var groundLayer;
var onGroundLayer;
var aboveLayer;
var objectLayer;
var statueGroup;
var gameScene;
var fire;
var slash;
var attacks = {};
function preload() {

  this.load.tilemapTiledJSON('map', 'assets/map.json');
  // tiles in spritesheet `
  this.load.spritesheet('basictiles', 'assets/basictiles.png', { frameWidth: 48, frameHeight: 48 });
  // load images
  this.load.atlas('hero', 'assets/hero.png', 'assets/hero.json');
  this.load.atlas('hit', 'assets/hit.png', 'assets/hit.json');
  this.load.atlas('sorcerer', 'assets/sorcerer.png', 'assets/sorcerer.json');
  this.load.atlas('sorcery', 'assets/sorcery.png', 'assets/sorcery.json');
  this.load.atlas('fire', 'assets/fire.png', 'assets/fire.json');
  this.load.atlas('slash', 'assets/slash.png', 'assets/slash.json');
  this.load.atlas('locating', 'assets/locating.png', 'assets/locating.json');
  this.load.image('statue', 'assets/statue.png');
  this.load.image('health', 'assets/health.png');
  //this.load.scenePlugin('GridPhysics', "./js/GridPhysics.js", "gridPhysics", "gridPhysics");
};

function characterReady(characInfo) {
  characs[characInfo.key] = gameScene.physics.add.sprite(characInfo.initX, characInfo.initY, characInfo.key, characInfo.key + '02.png');
  characs[characInfo.key].setBounce(0.2);
  characs[characInfo.key].body.setSize(characInfo.bodySizeX, characInfo.bodySizeY, true);
  characs[characInfo.key].body.setOffset(characInfo.bodyOffsetX, characInfo.bodyOffsetY);
  characs[characInfo.key].setCollideWorldBounds(true);
  characs[characInfo.key].setDepth(characs[characInfo.key].y);
  characs[characInfo.key].child = gameScene.physics.add.sprite(characInfo.initX, characInfo.initY, characInfo.key, "");
  characs[characInfo.key].child.visible = false;
  characs[characInfo.key].child.body.setSize(characInfo.bodySizeX + 15, characInfo.bodySizeY + 10, true);
  characs[characInfo.key].child.x = characs[characInfo.key].body.x + characs[characInfo.key].body.width;
  characs[characInfo.key].child.y = characs[characInfo.key].body.y + characs[characInfo.key].body.height;
  characs[characInfo.key].child.body.setImmovable(true)
  characs[characInfo.key].info = characInfo;
  characStatus[characInfo.key] = {} 
  characStatus[characInfo.key].namelb = gameScene.add.text(characInfo.healthBarLoc-50,10,characInfo.key, { fontSize: '25px bold', fill: '#ffffff'});
  characStatus[characInfo.key].namelb.setScrollFactor(0);
  characStatus[characInfo.key].health = gameScene.add.text(characInfo.healthBarLoc,40,characInfo.HP.toString(), { fontSize: '20px bold', fill: '#ffffff'});
  characStatus[characInfo.key].health.setScrollFactor(0);
  characStatus[characInfo.key].win = gameScene.add.text(characInfo.healthBarLoc,70,characInfo.win.toString(), { fontSize: '20px', fill: '#ffffff'});
  characStatus[characInfo.key].win.setScrollFactor(0);
  characStatus[characInfo.key].lose = gameScene.add.text(characInfo.healthBarLoc,100,characInfo.lose.toString(), { fontSize: '20px', fill: '#ffffff'});
  characStatus[characInfo.key].lose.setScrollFactor(0);
  characStatus[characInfo.key].name = characInfo.key;
  //characStatus[characInfo.key].info = characInfo;
  var healthlb = gameScene.add.text(characInfo.healthBarLoc-50,40,"HP", { fontSize: '15px', fill: '#ffffff'});
  healthlb.setScrollFactor(0);
  var winlb = gameScene.add.text(characInfo.healthBarLoc-50,70,"WIN", { fontSize: '15px', fill: '#ffffff'});
  winlb.setScrollFactor(0);
  var loselb = gameScene.add.text(characInfo.healthBarLoc-50,100,"LOSE", { fontSize: '15px', fill: '#ffffff'});
  loselb.setScrollFactor(0);
  //characs[characInfo.key].status.width = characInfo.HP;
  for (characKey in characs) {
    if (characKey != characInfo.key) {
      gameScene.physics.add.collider(characs[characKey], characs[characInfo.key]);
      //gameScene.physics.add.collider(characs[characKey].child,characs[characInfo.key].child);
      gameScene.physics.add.collider(characs[characKey].child, characs[characInfo.key]);
      gameScene.physics.add.collider(characs[characKey], characs[characInfo.key].child);
    }
  }
  for (attack in attacks){
    if (attacks[attack].info.owner != characInfo.key)
      gameScene.physics.add.overlap(characs[characInfo.key], attacks[attack],attackAct,null,gameScene);
  
  }
  let moves = ["down", "left", "right", "up"];
  for (var i = 0; i < moves.length; i++) {

    gameScene.anims.create({
      key: characInfo.key + "_" + moves[i],
      frames: gameScene.anims.generateFrameNames(characInfo.key, { prefix: characInfo.key, start: 4 * (i + 1) - 3, end: 4 * (i + 1), zeroPad: 2, suffix: '.png' }),
      frameRate: 5,
      repeat: -1
    });
    var startFrame = (characInfo.attackFrameSize * i + 1) % characInfo.attackFrameLength;
    var endFrame = (characInfo.attackFrameSize * (i + 1)) % characInfo.attackFrameLength;
    if (endFrame == 0) {
      endFrame = characInfo.attackFrameLength;
    }
    gameScene.anims.create({
      key: characInfo.key + "_hit_" + moves[i],
      frames: gameScene.anims.generateFrameNames(characInfo.attack, { prefix: "hit", start: startFrame, end: endFrame, zeroPad: 2, suffix: '.png' }),
      frameRate: characInfo.attackFrameRate,
      repeat: -1
    });
    gameScene.anims.create({
      key: characInfo.key + '_idle_' + moves[i],
      frames: gameScene.anims.generateFrameNames(characInfo.key, { prefix: characInfo.key, start: 4 * (i + 1), end: 4 * (i + 1), zeroPad: 2, suffix: '.png' }),
      frameRate: 10,
      repeat: 0
    });
  }
}
function finishGame(){
  for (charac in characs){
    characs[charac].info.HP = characs[charac].info.HP_origin; 
  }
}

function attackAct(charac,attack,extra){
  
  if (attack.attack){
    //characStatus[charac.info.key].namelb.setColor("#ff1818");
    attack.attack = false;
    console.debug(charac.info.key+" hitted");
    charac.info.HP -= attack.info.effect;
    if (charac.info.HP < charac.info.HP_origin/3){
      characStatus[charac.info.key].health.setColor("#ff1818");
    }

    if (charac.info.HP < 0){
      charac.info.HP = 0;
      charac.info.lose +=1;
      characs[attack.info.owner].info.win += 1;
      characStatus[charac.info.key].lose.setText(charac.info.lose);
      characStatus[attack.info.owner].win.setText(characs[attack.info.owner].info.win);
      finishGame();
      characStatus[charac.info.key].health.setColor("#ffffff");
    }
    characStatus[charac.info.key].health.setText(charac.info.HP);
  }
}
function attackEffectReady(attackInfo) {
  if (attackInfo.bodyEnable) {
    attacks[attackInfo.key] = gameScene.physics.add.sprite(400, 300, attackInfo.key, attackInfo.key + "01.png");
    attacks[attackInfo.key].body.setOffset(attacks[attackInfo.key].body.offset.x, attacks[attackInfo.key].height);
  }else{
    attacks[attackInfo.key] = gameScene.add.sprite(400, 300, attackInfo.key, attackInfo.key + "01.png");
  }
  attacks[attackInfo.key].visible = false;
  attacks[attackInfo.key].setScale(attackInfo.scale);
  attacks[attackInfo.key].attack = false;
  attacks[attackInfo.key].info = {}
  attacks[attackInfo.key].info = attackInfo;
  //attacks[attackInfo.key] = attackInfo;
  gameScene.anims.create({
    key: attackInfo.key,
    frames: gameScene.anims.generateFrameNames(attackInfo.key, { prefix: attackInfo.key, start: 0, end: attackInfo.frameSize, zeroPad: 2, suffix: '.png' }),
    frameRate: attackInfo.frameRate,
    repeat: attackInfo.repeat
  });
}
// executed once, after assets were loaded
function create() {
  this.debugGraphics = this.add.graphics();
  gameScene = this;
  map = this.make.tilemap({ key: 'map' });
  var groundTiles = map.addTilesetImage('basictiles');
  baseLayer = map.createDynamicLayer("base", groundTiles, 0, 0);
  groundLayer = map.createDynamicLayer("ground", groundTiles, 0, 0);
  onGroundLayer = map.createDynamicLayer("onGround", groundTiles, 0, 0);
  onGroundLayer.setCollisionByExclusion([-1]);
  aboveLayer = map.createDynamicLayer("above", groundTiles, 0, 0);
  aboveLayer.setDepth(100);
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;

  // attack set 
  var attackInfoSlash = { key: "slash", scale: 3.0, frameSize: 6, frameRate: 30, repeat: -1 ,effect:3,owner:"hero",bodyEnable:true};
  var attackInfoFire = { key: "fire", scale: 1.5, frameSize: 12, frameRate: 30, repeat: 1,effect:9 ,owner:"sorcerer",bodyEnable:true};
  var attackInfoLocating1 = { key: "locating", scale: 2.0, frameSize: 5, frameRate: 30, repeat: -1,effect:0 ,owner:"sorcerer",bodyEnable:false};
  attackEffectReady(attackInfoSlash);
  attackEffectReady(attackInfoFire);
  attackEffectReady(attackInfoLocating1);

  // Create Sorcerer  
  let characInfo_sorcerer = {
    key: "sorcerer", initX: 500, initY: 500, attackFrameSize: 6, attack: "sorcery", attackFrameLength: 12, attackFrameRate: 5,
    bodySizeX: 17, bodySizeY: 10, bodyOffsetX: 23, bodyOffsetY: 83, bodyOffsetXAnim: 65, moveVal: 200, healthBarLoc : gameScene.enemyMaxX-100,HP: 50,HP_origin:50 ,str: 10, win: 0, lose: 0
  };
  characterReady(characInfo_sorcerer);
  characInfos.characInfo_sorcerer = characInfo_sorcerer;

  // Create Hero
  let characInfo_hero = {
    key: "hero", initX: 50, initY: 200, attackFrameSize: 3, attack: "hit", attackFrameLength: 12, attackFrameRate: 8,
    bodySizeX: 17, bodySizeY: 10, bodyOffsetX: 17, bodyOffsetY: 83, bodyOffsetXAnim: 67, moveVal: 200,healthBarLoc : 100, HP: 80,HP_origin:80 ,str: 3, win: 0, lose: 0
  };
  characterReady(characInfo_hero);
  characInfos.characInfo_hero = characInfo_hero;

  statueGroup = this.physics.add.group();
  statueGroup.enableBody = true;
  statueGroup.physicsBodyType = Phaser.Physics.ARCADE;
  statueGroup.create(200, 300, 'statue');
  statueGroup.create(450, 600, 'statue');
  statueGroup.create(700, 300, 'statue');
  statueGroup.children.iterate(function (child) {

    child.body.setSize(75, 40, true);
    child.body.setOffset(0, 80);
    child.setCollideWorldBounds(true);
    child.setImmovable(true);
    child.setDepth(child.y);
  });

  this.physics.add.collider(onGroundLayer, characs.hero);
  this.physics.add.collider(statueGroup, characs.hero);
  this.physics.add.collider(onGroundLayer, characs.sorcerer);
  this.physics.add.collider(statueGroup, characs.sorcerer);
  this.physics.add.collider(onGroundLayer, statueGroup);
  //this.physics.add.collider(characs.hero, characs.sorcerer);
  //keyboard
  cursors = gameScene.input.keyboard.createCursorKeys();
  gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  gameScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  myInput.A = Phaser.Input.Keyboard.KeyCodes.A;
  myInput.S = Phaser.Input.Keyboard.KeyCodes.S;
  myInput.D = Phaser.Input.Keyboard.KeyCodes.D;
  myInput.W = Phaser.Input.Keyboard.KeyCodes.W;


  //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  //this.cameras.main.startFollow(hero);
  // set background color, so the sky is not black    
  //this.cameras.main.setBackgroundColor('#ccccff');
}

// executed on every frame (60 times per second)

var direction = { hero: 1, sorcerer: 1 };
var initAttack = { hero: true, sorcerer: true }
var characAttack = { hero: { key: "slash", type: "near" }, sorcerer: { key: "fire", type: "far", dist: 250 } }
function AttackSys(characKey) {
  var attackKey = characAttack[characKey].key;
  var attackType = characAttack[characKey].type;
  attacks[attackKey].setDepth(attacks[attackKey].y + 20);
  if (attackType == "near") {
    if (direction[characKey] == 1) {
      //down
      attacks[attackKey].y = characs[characKey].y + attacks[attackKey].height + 10;
      attacks[attackKey].x = characs[characKey].x;
    } else if (direction[characKey] == 2) {
      // left
      attacks[attackKey].y = characs[characKey].y - 10;
      attacks[attackKey].x = characs[characKey].x - characs[characKey].body.width * 2;
    } else if (direction[characKey] == 3) {
      // right
      attacks[attackKey].y = characs[characKey].y - 10;
      attacks[attackKey].x = characs[characKey].x + characs[characKey].body.width * 2;
    } else {
      // up
      attacks[attackKey].y = characs[characKey].y - attacks[attackKey].height - 20;
      attacks[attackKey].x = characs[characKey].x;
    }

  }

  if (attackType == "far") {
    var dist = characAttack[characKey].dist;
    var characDist = distFunc(characs.hero.x, characs.hero.y, characs.sorcerer.x, characs.sorcerer.y);
    attacks.locating.setDepth(attacks[attackKey].y + 50);
    if (characDist < dist) {
      attacks[attackKey].x = characs.hero.x;
      attacks[attackKey].y = characs.hero.y;
      attacks.locating.visible = true;
      attacks.locating.play("locating",true);
      attacks.locating.x = characs.hero.x ;
      attacks.locating.y = characs.hero.y ;
    } else {
      var xSign = Math.sign(characs.hero.x - characs.sorcerer.x);
      var ySign = Math.sign(characs.hero.y - characs.sorcerer.y);

      var distX = (characs.hero.x - characs.sorcerer.x);
      var distY = (characs.hero.y - characs.sorcerer.y);

      distX = (distX / characDist) * dist;
      distY = (distY / characDist) * dist;
      attacks[attackKey].x = characs.sorcerer.x + distX;
      attacks[attackKey].y = characs.sorcerer.y + distY;
      attacks.locating.visible = true;
      attacks.locating.play("locating",true);
      attacks.locating.x = characs.sorcerer.x + distX;
      attacks.locating.y = characs.sorcerer.y + distY;


    }
  }

  if (characs[characKey].anims.currentFrame != null && initAttack[characKey] && characs[characKey].anims.currentFrame.isLast) {
    attacks[attackKey].visible = true;
    attacks[attackKey].anims.play(attackKey, true);
    initAttack[characKey] = false;
    attacks[attackKey].attack = true;
    //console.debug(characKey + " attack!!");
  };
  if (characs[characKey].anims.currentFrame != null && !characs[characKey].anims.currentFrame.isLast) {
    initAttack[characKey] = true;
    attacks[attackKey].attack = false;
    if (attacks[attackKey].anims.currentFrame != null && attacks[attackKey].anims.currentFrame.isLast) {
      attacks[attackKey].visible = false;
    }
  }
}


function myBodyRefresh(characKey) {
  characs[characKey].body.setSize(characInfos["characInfo_" + characKey].bodySizeX, characInfos["characInfo_" + characKey].bodySizeY, true);
  characs[characKey].body.setOffset(characs[characKey].body.offset.x, characs[characKey].height - characInfos["characInfo_" + characKey].bodySizeY);
  characs[characKey].setDepth(characs[characKey].y);
  characs[characKey].child.x = characs[characKey].body.x + characs[characKey].body.width / 2;
  characs[characKey].child.y = characs[characKey].body.y + characs[characKey].body.height / 2;
}

function characterAction(characKey, charInput) {
  //console.debug(Phaser.Input.Keyboard.JustDown(Phaser.Input.Keyboard.KeyCodes.A));
  //console.debug(gameScene.input.keyboard.isUp(Phaser.Input.Keyboard.KeyCodes.A));
  if (charInput.Down) {

    characs[characKey].body.setVelocityY(characInfos["characInfo_" + characKey].moveVal);
    characs[characKey].body.setVelocityX(0);
    characs[characKey].anims.play(characKey + '_down', true);
    /*
    if (charInput.Attack) {
      characs[characKey].anims.play(characKey+'_hit_down', true);
    } else {
      characs[characKey].anims.play(characKey+'_down', true);
    }
    */
    direction[characKey] = 1;
  } else if (charInput.Left) {
    characs[characKey].body.setVelocityX(-characInfos["characInfo_" + characKey].moveVal);
    characs[characKey].body.setVelocityY(0);
    characs[characKey].anims.play(characKey + '_left', true);
    /*
    if (charInput.Attack) {
      characs[characKey].anims.play(characKey+'_hit_left', true);
    } else {
      characs[characKey].anims.play(characKey+'_left', true);
    }
    */
    direction[characKey] = 2;
  }
  else if (charInput.Right) {
    characs[characKey].body.setVelocityX(characInfos["characInfo_" + characKey].moveVal);
    characs[characKey].body.setVelocityY(0);
    characs[characKey].anims.play(characKey + '_right', true);
    /*
    if (charInput.Attack) {
      characs[characKey].anims.play(characKey+'_hit_right', true);
    } else {
      characs[characKey].anims.play(characKey+'_right', true);
    }
    */
    direction[characKey] = 3;
  } else if (charInput.Up) {
    characs[characKey].body.setVelocityY(-characInfos["characInfo_" + characKey].moveVal);
    characs[characKey].body.setVelocityX(0);
    characs[characKey].anims.play(characKey + '_up', true);
    /*
    if (charInput.Attack) {
      characs[characKey].anims.play(characKey+'_hit_up', true);
    } else {
      characs[characKey].anims.play(characKey+'_up', true);
    }
    */
    direction[characKey] = 4;
  } else if (charInput.Attack) {
    characs[characKey].body.setVelocityY(0);
    characs[characKey].body.setVelocityX(0);

    if (direction[characKey] == 1) {
      characs[characKey].anims.play(characKey + '_hit_down', true);
    }
    else if (direction[characKey] == 2) {
      characs[characKey].anims.play(characKey + '_hit_left', true);

    }
    else if (direction[characKey] == 3) {
      characs[characKey].anims.play(characKey + '_hit_right', true);
    }
    else if (direction[characKey] == 4) {
      characs[characKey].anims.play(characKey + '_hit_up', true);
    }
    AttackSys(characKey);
    /*
    if(characs[characKey].anims.currentFrame !=null && initAttack[characKey] && characs[characKey].anims.currentFrame.isLast){
      console.debug("Attack!!!!");
      initAttack[characKey] = false;
      if (characKey == "sorcerer") {
        fire.x = characs.hero.x;
        fire.y = characs.hero.y;
        fire.setDepth(characs.hero.depth+1);
        fire.visible = true;
        fire.anims.play("fire",true);
      }
    };
    if(characs[characKey].anims.currentFrame !=null && !characs[characKey].anims.currentFrame.isLast){
      initAttack[characKey] = true;
      
      if (characKey == "sorcerer" && fire.anims.currentFrame != null &&fire.anims.currentFrame.isLast) {
        fire.visible = false;
      }
    }
    */
  } else {
    characs[characKey].body.setVelocityY(0);
    characs[characKey].body.setVelocityX(0);
    if (direction[characKey] == 1) {
      characs[characKey].anims.play(characKey + '_idle_down', true);
    }
    else if (direction[characKey] == 2) {
      characs[characKey].anims.play(characKey + '_idle_left', true);

    }
    else if (direction[characKey] == 3) {
      characs[characKey].anims.play(characKey + '_idle_right', true);
    }
    else if (direction[characKey] == 4) {
      characs[characKey].anims.play(characKey + '_idle_up', true);
    }

  }
  if (charInput.AttackQuit) {
    attacks.locating.visible = false;
    attacks[characAttack[characKey].key].visible = false;
    attacks[characAttack[characKey].key].attack = false;
  }
  myBodyRefresh(characKey);
}

function update(time, delta) {
  sorcererInput = {
    Up: gameScene.input.keyboard.keys[myInput.W].isDown,
    Down: gameScene.input.keyboard.keys[myInput.S].isDown,
    Left: gameScene.input.keyboard.keys[myInput.A].isDown,
    Right: gameScene.input.keyboard.keys[myInput.D].isDown,
    Attack: cursors.shift.isDown,
    AttackQuit: cursors.shift.isUp
  };
  heroInput = {
    Up: cursors.up.isDown, Down: cursors.down.isDown, Left: cursors.left.isDown, Right: cursors.right.isDown,
    Attack: cursors.space.isDown,
    AttackQuit: cursors.space.isUp
  };
  characterAction("hero", heroInput);
  characterAction("sorcerer", sorcererInput);

};

function render() {
  game.debug.body(hero);
  game.debug.body(statueGroup);
  game.debug.text('Sprite z-depth: ' + hero.z, 100, 200);
}

function distFunc(x1, y1, x2, y2) {
  var deltaX = Math.abs(x1 - x2);
  var deltaY = Math.abs(y1 - y2);
  var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  return (dist);
};