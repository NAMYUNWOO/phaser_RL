var config = {
  type: Phaser.AUTO,
  width: 960,
  height: 960,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: {y: 0},
          debug: true
      }
  },
  scene: {
      key: 'main',
      init:init,
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
this.enemyMaxY = 480;
this.enemyMinY = 480;
this.tileSize = 48;
this.bodySizeX = function(char){return char.width/3};
this.bodySizeY = 10;
this.bodyOffsetX = 17;
this.bodyOffsetY = 83;
this.bodyOffsetXAnim = 62; 
}

var hero;
var cursors;
var map;
var baseLayer;
var groundLayer;
var onGroundLayer;
var aboveLayer;
var objectLayer;
var statueGroup;
var gameScene;
function preload () {

this.load.tilemapTiledJSON('map', 'assets/map.json');
// tiles in spritesheet `
this.load.spritesheet('basictiles', 'assets/basictiles.png', { frameWidth: 48, frameHeight: 48 });
// load images
this.load.atlas('hero', 'assets/hero.png', 'assets/hero.json');
this.load.atlas('hit', 'assets/hit.png', 'assets/hit.json');
this.load.image('statue', 'assets/statue.png');
//this.load.scenePlugin('GridPhysics', "./js/GridPhysics.js", "gridPhysics", "gridPhysics");
};

// executed once, after assets were loaded
function create () {
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

hero = this.physics.add.sprite(50, 200, 'hero', 'hero02.png');

hero.setBounce(0.2);
hero.body.setSize(this.bodySizeX(hero), this.bodySizeY,true);
hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
console.debug(hero.body);
hero.setCollideWorldBounds(true);
hero.setDepth(hero.y);
this.physics.add.collider(onGroundLayer, hero);
statueGroup = this.physics.add.group();
statueGroup.enableBody = true;
statueGroup.physicsBodyType = Phaser.Physics.ARCADE;
statueGroup.create(70, 300, 'statue');
statueGroup.create(500, 500, 'statue');
statueGroup.create(700, 300, 'statue');

statueGroup.children.iterate(function (child) {

  child.body.setSize(75, 40,true);
  child.body.setOffset(0,80);
  child.setCollideWorldBounds(true);
  child.setImmovable(true);
  child.setDepth(child.y);
});

this.physics.add.collider(statueGroup, hero);
this.physics.add.collider(onGroundLayer,statueGroup);
//keyboard
cursors = this.input.keyboard.createCursorKeys();
let moves = ["down", "left", "right", "up"];
for (var i = 0; i < moves.length; i++) {

  this.anims.create({
    key: moves[i],
    frames: this.anims.generateFrameNames('hero', { prefix: 'hero', start: 4 * (i + 1) - 3, end: 4 * (i + 1), zeroPad: 2, suffix: '.png' }),
    frameRate: 5,
    repeat: -1
  });
  this.anims.create({
    key: "hit" + moves[i],
    frames: this.anims.generateFrameNames('hit', { prefix: 'hit', start: 3 * (i + 1) - 2, end: 3 * (i + 1), zeroPad: 2, suffix: '.png' }),
    frameRate: 15,
    repeat: -1
  });
  this.anims.create({
    key: 'idle' + moves[i],
    frames: this.anims.generateFrameNames('hero', { prefix: 'hero', start: 4 * (i + 1), end: 4 * (i + 1), zeroPad: 2, suffix: '.png' }),
    frameRate: 10,
    repeat: 0
  });
}
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  // make the camera follow the player
  this.cameras.main.startFollow(hero);

  // set background color, so the sky is not black    
  this.cameras.main.setBackgroundColor('#ccccff');
}

// executed on every frame (60 times per second)
var direction = 1;

function update(time,delta) {

// Player Action Start//
if (cursors.down.isDown) {
  
  hero.body.setVelocityY(gameScene.moveVal);
  hero.setDepth(hero.y);
  hero.body.setVelocityX(0);
  //hero.y += this.playerSpeed;
  if (cursors.space.isDown) {
    hero.anims.play('hitdown', true);
    hero.body.setOffset(gameScene.bodyOffsetXAnim, this.bodyOffsetY);
  } else {
    hero.anims.play('down', true);
    hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
  }
  direction = 1;
} else if (cursors.left.isDown) {
  hero.body.setVelocityX(-gameScene.moveVal);
  hero.body.setVelocityY(0);
  if (cursors.space.isDown) {
    hero.anims.play('hitleft', true);
    hero.body.setOffset(gameScene.bodyOffsetXAnim, this.bodyOffsetY);
  } else {
    hero.anims.play('left', true);
    hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
  }
  direction = 2;
}
else if (cursors.right.isDown) {
  hero.body.setVelocityX(gameScene.moveVal);
  hero.body.setVelocityY(0);
  //hero.x += this.playerSpeed;

  if (cursors.space.isDown) {
    hero.anims.play('hitright', true);
    hero.body.setOffset(gameScene.bodyOffsetXAnim, this.bodyOffsetY);
  } else {
    hero.anims.play('right', true);
    hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
  }
  direction = 3;
} else if (cursors.up.isDown) {
  hero.body.setVelocityY(-gameScene.moveVal);
  hero.setDepth(hero.y);
  hero.body.setVelocityX(0);
  //hero.y -= this.playerSpeed;
  if (cursors.space.isDown) {
    hero.anims.play('hitup', true);
    hero.body.setOffset(gameScene.bodyOffsetXAnim, this.bodyOffsetY);
  } else {
    hero.anims.play('up', true);
    hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
  }

  direction = 4;
} else if (cursors.space.isDown) {
  hero.body.setOffset(gameScene.bodyOffsetXAnim, this.bodyOffsetY);
  hero.body.setVelocityY(0);
  hero.body.setVelocityX(0);
  if (direction == 1) {
    hero.anims.play('hitdown', true);
  }
  else if (direction == 2) {
    hero.anims.play('hitleft', true);

  }
  else if (direction == 3) {
    hero.anims.play('hitright', true);
  }
  else if (direction == 4) {
    hero.anims.play('hitup', true);
  }

} else {
  hero.body.setOffset(this.bodyOffsetX, this.bodyOffsetY);
  
  hero.body.setVelocityY(0);
  hero.body.setVelocityX(0);
  if (direction == 1) {
    hero.anims.play('idledown', true);
  }
  else if (direction == 2) {
    hero.anims.play('idleleft', true);

  }
  else if (direction == 3) {
    hero.anims.play('idleright', true);
  }
  else if (direction == 4) {
    hero.anims.play('idleup', true);
  }
}
// Player Action End//
};

function render(){
game.debug.body(hero);
game.debug.body(statueGroup);
game.debug.text('Sprite z-depth: ' + hero.z, 100, 200);
}
