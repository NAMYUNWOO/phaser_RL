var config = {
    type: Phaser.AUTO,
    width: 960,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        key: 'main',
        init:init,
        preload: preload,
        create: create,
        update: update
    }
};
let game = new Phaser.Game(config);
//let gameScene = new Phaser.Scene("Game");
 // load asset files for our game

function init() {
  this.playerSpeed = 2.0;
  this.enemyMaxY = 480;
  this.enemyMinY = 480;
  this.tileSize = 48;
}

var hero;
var cursors;
var map;
var groundLayer;
var onGroundLayer;
var aboveLayer;
var objectLayer;
function preload () {
  this.load.tilemapTiledJSON('map', 'assets/map.json');
  // tiles in spritesheet `
  this.load.spritesheet('basictiles', 'assets/basictiles.png', { frameWidth: 48, frameHeight: 48 });
  // load images
  this.load.atlas('hero', 'assets/hero.png', 'assets/hero.json');
  this.load.atlas('hit', 'assets/hit.png', 'assets/hit.json');
  //this.load.scenePlugin('GridPhysics', "./js/GridPhysics.js", "gridPhysics", "gridPhysics");
};

// executed once, after assets were loaded
function create () {
  map = this.make.tilemap({ key: 'map' });
  var groundTiles = map.addTilesetImage('basictiles');
  groundLayer = map.createDynamicLayer("ground", groundTiles, 0, 0);
  onGroundLayer = map.createDynamicLayer("onGround", groundTiles, 0, 0);
  onGroundLayer.setCollisionByExclusion([-1]);
  aboveLayer = map.createDynamicLayer("above", groundTiles, 0, 0);
  aboveLayer.setDepth(10);
  this.physics.world.bounds.width = groundLayer.width;
  this.physics.world.bounds.height = groundLayer.height;
 
  hero = this.physics.add.sprite(50, 200, 'hero', 'hero02.png');
  
  hero.setBounce(0.2);
  hero.body.setSize(hero.width/3, 10,true);
  hero.body.setOffset(hero.width/3, hero.height-10);
  hero.setCollideWorldBounds(true);
  this.physics.add.collider(onGroundLayer, hero);
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
    //this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');
}

// executed on every frame (60 times per second)
var direction = 1;

function update(time,delta) {

  // Player Action Start//
  if (cursors.down.isDown) {

    hero.body.setVelocityY(200);
    hero.body.setVelocityX(0);
    //hero.y += this.playerSpeed;
    if (cursors.space.isDown) {
      hero.anims.play('hitdown', true);
    } else {
      hero.anims.play('down', true);
    }
    direction = 1;
  } else if (cursors.left.isDown) {
    hero.body.setVelocityX(-200);
    hero.body.setVelocityY(0);
    if (cursors.space.isDown) {
      hero.anims.play('hitleft', true);
    } else {
      hero.anims.play('left', true);
    }
    direction = 2;
  }
  else if (cursors.right.isDown) {
    hero.body.setVelocityX(200);
    hero.body.setVelocityY(0);
    //hero.x += this.playerSpeed;

    if (cursors.space.isDown) {
      hero.anims.play('hitright', true);
    } else {
      hero.anims.play('right', true);
    }
    direction = 3;
  } else if (cursors.up.isDown) {
    hero.body.setVelocityY(-200);
    hero.body.setVelocityX(0);
    //hero.y -= this.playerSpeed;
    if (cursors.space.isDown) {
      hero.anims.play('hitup', true);
    } else {
      hero.anims.play('up', true);
    }

    direction = 4;
  } else if (cursors.space.isDown) {
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
