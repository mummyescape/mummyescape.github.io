var levelThreeGameState = {

  init: function(currentLevel) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 900;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.world.setBounds(0,0,360,1200);

    this.X_MIN = 0;
    this.X_MAX = 360;
    this.Y_MIN = 0;
    this.Y_MAX = 1200;
    this.RUNNING_SPEED = 220;
    this.JUMPING_SPEED = 580;
    this.SPEAR_SPEED = 350;
    this.SWORD_SPEED = 750;

    this.startMakingSword = null;
    this.game.stage.backgroundColor = '#f4eab7'


  },

  preload: function() {
    this.load.spritesheet('hippy', 'assets/images/hippy.png', 30, 62, 4);
    this.load.spritesheet('ant', 'assets/images/ant.png', 84, 40, 5);
    this.load.spritesheet('sword', 'assets/images/sword.png', 34, 18, 1);
    this.load.spritesheet('blueBird', 'assets/images/blueBird.png', 119, 70, 4, 1);
    this.load.spritesheet('spike', 'assets/images/spike.png', 270, 27, 4, 0, 0);
    this.load.spritesheet('fireBall', 'assets/images/fireBall.png', 16, 15, 3, 0, 0);
    this.load.spritesheet('ghost', 'assets/images/ghost.png', 39, 70, 3, 0, 0);
    this.load.image('trap', 'assets/images/trap.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('spear', 'assets/images/spear.png');
    this.load.image('goal', 'assets/images/goal.png');
    this.load.image('partical', 'assets/images/partical.png');
    this.load.image('wizard', 'assets/images/wizard.png');
    this.load.text('level1', 'assets/data/levelOne.json');
    this.load.text('level2', 'assets/data/levelTwo.json');
    this.load.text('level3', 'assets/data/levelThree.json');
    this.load.audio('levelThreeSong', ['assets/sounds/levelThreeSong.mp3', 'assets/sounds/levelThreeSong.ogg'])
    this.load.audio('levelOneSong', ['assets/sounds/levelOneSong.mp3', 'assets/sounds/levelOneSong.ogg']);
  },

  create: function() {
    var style = { font: '16px Arial', fill: '#000'};
    this.livesText = this.game.add.text(280, 650, 'Lives: ' + lives, style);
    this.livesText.fixedToCamera = true;
    this.livesText.cameraOffset.y = 40;

    this.levelData = JSON.parse(this.game.cache.getText('level3'));

    this.levelOneSong = this.add.audio('levelOneSong');
    this.levelOneSong.play();
    this.levelOneSong.loop = true

    //music
    // this.levelThreeSong = this.add.audio('levelThreeSong');
    // this.levelThreeSong.loop = true;
    // this.levelThreeSong.play();

    //bottom floor
    this.ground = this.add.sprite(0, 1160, 'platform');
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    //start point
    this.startPoint = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'goal');
    this.game.physics.arcade.enable(this.startPoint);
    this.startPoint.body.immovable = true;
    this.startPoint.body.allowGravity = false;

    //player
    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'hippy');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('walking', [1,2,3], 5, true);

    //goal
    this.goal = this.add.sprite(this.levelData.goalCoord.x, this.levelData.goalCoord.y, 'goal');
    this.game.physics.arcade.enable(this.goal);
    this.goal.body.allowGravity = false;

    //swords
    this.swords = this.add.group();
    this.swords.enableBody = true;
    this.swords.customParams = {};

    //ants group
    this.ants = this.add.group();
    this.ants.enableBody = true;

    //traps group
    this.traps = this.add.group();
    this.traps.enableBody = true;

    //spears group
    this.spears = this.add.group();
    this.spears.enableBody = true;
    this.spears.customParams = {};

    ////TIMER TIMER TIMER
    ////TIMER TIMER TIMER
    var antTimer = 0
    this.antCreator = this.game.time.events.loop(Phaser.Timer.SECOND * 1, function() {
      if (this.blueBird.customParams.hits < 5) {
        if (this.blueBird.customParams.hits < 1) {
          this.shootFireBalls(3);
        }  else if (this.blueBird.customParams.hits < 3) {
          this.shootFireBalls(4);
        } else {
          this.shootFireBalls(5);
        }
      this.flyBlueBird();
    } else {
      antTimer += 1
      if (antTimer % 5 === 0) {
      this.createAnt();
      }
    }
    }, this);


    //platforms
    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    //spikes
    this.spikes = this.add.group();
    this.spikes.enableBody = true;

    //blueBird
    this.blueBird = this.add.sprite(10, this.player.y - 200, 'ghost');
    game.physics.arcade.enable(this.blueBird);
    this.blueBird.anchor.setTo(0.5);
    this.blueBird.customParams = {};
    this.blueBird.customParams.hits = 0
    this.blueBird.customParams.nextFromAbove = true
    this.blueBird.customParams.animReady = true
    this.blueBird.body.allowGravity = false;
    this.blueBird.body.bounce.set(1,0);
    this.blueBird.animations.add('hurt', [1,2,1,2,1,2,1,2], 5, false);

    this.blueBird.body.velocity.x = 200;
    this.blueBird.body.velocity.y = -99;

    //fireBalls
    this.fireBalls = this.add.group();
    this.fireBalls.enableBody = true;

    //this.createSpike = Phaser.Timer.SECOND * this.levelData.secondsForAntGen, this.createSpike, this;

    //ground set at 1100

    //camera follows player
    this.game.camera.follow(this.player);



    //generate platforms from JSON Level File
    this.levelData.platformData.forEach(function(element){

      var platform = this.platforms.create(element.x, element.y, 'platform');

    }, this)

    //set a all platforms to immovable and to allow gravity
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //generate traps JSON Level File
    this.levelData.trapData.forEach(function(element){

      var trap = this.traps.create(element.x, element.y, 'trap');
      trap.body.allowGravity = true;

    }, this)


    /// keyboard control objects
    this.shootRightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.shootRightKey.ready = false;

    this.shootLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.shootLeftKey.ready = false;

    this.shootUpKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.shootUpKey.ready = false;


    //shoot fireBalls
    //this.shootFireBallsLopp = this.game.time.events.loop(Phaser.Time.SECOND * this.levelData.secondsForAntGen / 10, this.shootFireBalls(), this);
    //fly blue bird
    //this.multiBlueBirdFlight = this.game.time.events.loop(Phaser.Time.SECOND * 8, this.flyBlueBird(), this);
  },

  update: function() {

    if(this.shootRightKey.isDown){
      this.shootRightKey.ready = true;
    }
    if(this.shootRightKey.isUp && this.shootRightKey.ready) {
      this.player.customParams.shootLeft = false;
      this.player.customParams.shootUp = false;
      this.player.customParams.shootRight = true;
      this.createSword();
      this.shootRightKey.ready = false;
    }
    //shoot left
    if(this.shootLeftKey.isDown) {
      this.shootLeftKey.ready = true;
    }
    if(this.shootLeftKey.isUp && this.shootLeftKey.ready) {
      this.player.customParams.shootLeft = true;
      this.player.customParams.shootUp = false;
      this.player.customParams.shootRight = false;
      this.createSword();
      this.shootLeftKey.ready = false;
    }
    //shoot up
    if(this.shootUpKey.isDown) {
      this.shootUpKey.ready = true;
    }
    if(this.shootUpKey.isUp && this.shootUpKey.ready) {
      this.player.customParams.shootLeft = false;
      this.player.customParams.shootUp = true;
      this.player.customParams.shootRight = false;
      this.createSword();
      this.shootUpKey.ready = false;
    }

    // enable physics for player, traps and ants
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.collide(this.ants, this.ground);
    this.game.physics.arcade.collide(this.ants, this.platforms);

    this.game.physics.arcade.collide(this.traps, this.ground);
    this.game.physics.arcade.collide(this.traps, this.platforms);

    this.game.physics.arcade.overlap(this.ants, this.player, this.killPlayer);
    this.game.physics.arcade.overlap(this.spears, this.player, this.killPlayer);
    // this.game.physics.arcade.overlap(this.blueBird, this.player, this.killPlayer);
    // this.game.physics.arcade.overlap(this.player, this.fireBalls, this.killPlayer)

    if(this.game.physics.arcade.overlap(this.blueBird, this.player) ||  this.game.physics.arcade.overlap(this.player, this.fireBalls)){
      // this.levelThreeSong.stop();
      this.killPlayer()
    }

    this.game.physics.arcade.overlap(this.player, this.goal, this.levelCleared);

    //kill all sowrds that are out of bounds
    this.killSwordsOutBounds();
    this.killSpearsOutBounds();

    this.player.body.velocity.x = 0
    //Move Player -- Left and Right
    if (this.cursors.left.isDown || this.player.customParams.movingLeft) {
      this.player.body.velocity.x -= this.RUNNING_SPEED;
      this.player.scale.setTo(-1, 1);
      this.player.play('walking');

    } else if (this.cursors.right.isDown || this.player.customParams.movingRight) {
      this.player.body.velocity.x += this.RUNNING_SPEED;
      this.player.scale.setTo(1, 1);
      this.player.play('walking');


    } else {
      this.player.animations.stop();
      this.player.frame = 8;
    }

    //Move Player -- Jump
    if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.animations.stop();
      this.player.frame = 0;
      this.player.body.velocity.y -= this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }
    // loop through fireBalls will them if they go beyond y > 1200
    this.fireBalls.forEach(function(fireBallelement){
      if (fireBallelement.y > 1200) {
        fireBallelement.kill();
      }
    }, this);

    this.swords.forEach(function(swordElement){
      if (this.game.physics.arcade.overlap(this.blueBird, swordElement)){
        swordElement.kill();
        this.blueBird.customParams.hits += 1;
        this.blueBird.play('hurt');
        console.log(this.blueBird.customParams.hits);
        if(this.blueBird.customParams.hits >= 3) {
          console.log("you will bitch")
        }
      }
    }, this);
    // loop through ants to make them walk, check if they get hit by player attack or should exit
    this.ants.forEach(function(element) {
      element.play('crawling');
      if (element.body.velocity.x > 0) {
        element.scale.setTo(1,1);

      } else if (element.body.velocity.x < 0) {
        element.scale.setTo(-1,1);
      }

      if (this.game.physics.arcade.collide(element, this.startPoint)) {
        element.kill();
      }

        this.swords.forEach(function(swordElement){


          if (this.game.physics.arcade.overlap(element, swordElement)){
            swordElement.kill();
            element.scale.setTo(1, -1);
            element.body.velocity.x = 0;
            element.animations.stop();
            element.play('dying');
            element.customParams.hit += 1

            if (element.customParams.hit >= 2) {
              //death sequence
              var emitter = this.game.add.emitter(element.x, element.y, 100);
              emitter.makeParticles('partical');
              emitter.minParticleSpeed.setTo(-150,-150);
              emitter.maxParticleSpeed.setTo(150,150);
              emitter.gravity = 200;
              emitter.start(true, 500, null, 100);
              element.kill();
            }
          }
        },element ,this)
    }, this)

    this.traps.forEach(function(element){
      if (this.game.physics.arcade.overlap(element, this.player)) {
        element.kill();

        this.createSpear();
      }
    }, this)

    if (this.blueBird.customParams.hits >= 5 && this.blueBird.customParams.animReady) {

      var emitter = this.game.add.emitter(this.blueBird.x, this.blueBird.y, 100);
      emitter.makeParticles('partical');
      emitter.minParticleSpeed.setTo(-150,-150);
      emitter.maxParticleSpeed.setTo(150,150);
      emitter.gravity = 200;
      emitter.start(true, 500, null, 100);
      this.blueBird.customParams.animReady = false
      this.blueBird.kill();
    }
  }, // *** end of update method

  killPlayer: function(player, enemy) {
    lives -= 1
    if (lives < 1) {
    lives = 3
    game.state.start('levelOneGameState');
  } else {
    game.state.start('levelThreeGameState');
  }
  },

  createAnt: function() {
    // the false in getFirstExists tells method to grab the first dead ant verse live one
    var ant = this.ants.getFirstExists(false)

    if (!ant) {
    ant = this.ants.create(this.levelData.goalCoord.x, this.levelData.goalCoord.y, 'ant');
    }

    ant.reset(this.levelData.goalCoord.x, this.levelData.goalCoord.y)
    ant.animations.add('crawling', [0,1,2], 5, true);
    ant.animations.add('dying', [3,4], 5, true);
    ant.anchor.setTo(0.5);
    ant.enableBody = true;
    ant.customParams = {};
    ant.customParams.hit = 0
    ant.body.collideWorldBounds = true;
    ant.body.bounce.set(1,0);
    ant.body.velocity.x = this.levelData.antSpeed;
    ant.scale.setTo(-1,1);
  },

  createSword: function() {
    var sword = this.swords.getFirstExists(false)
    if (!sword) {
      sword = this.swords.create(this.player.x, this.player.y, 'sword');
      sword.customParams = {};
      sword.customParams.pointing = null;
      }
    sword.reset(this.player.x, this.player.y, 'sword');
    sword.anchor.setTo(0.5);
    sword.enableBody = true;
    sword.body.allowGravity = false;

    if (this.player.customParams.shootLeft) {
      sword.customParams.pointing = 'left'
      sword.angle = 0;
      sword.body.velocity.x = -this.SWORD_SPEED;
      sword.body.velocity.y = 0;
      sword.scale.setTo(-1,1);

    } else if (this.player.customParams.shootRight) {
      sword.customParams.pointing = 'right'
      sword.angle = 0;
      sword.body.velocity.x = this.SWORD_SPEED;
      sword.body.velocity.y = 0;
      sword.scale.setTo(1,1);
    } else if (this.player.customParams.shootUp) {
      sword.body.velocity.x = 0
      sword.body.velocity.y = -this.SWORD_SPEED;
      if (sword.customParams.pointing == 'right') {
          sword.angle = 270;
      } else if (sword.customParams.pointing == 'left') {
          sword.angle = 90;
      } else if (sword.customParams.pointing == null) {
          sword.angle = 270;
      }
      sword.customParams.pointing = 'up'
    }
  },

  createSpear: function() {
    // grab player coords at time of method call incase coords change
    var playerX = this.player.x;
    var playerY = this.player.y;
    // Xcoords for spears to start base on side they enter from
    var fromLeftXCoords = [-150, -10, -300];
    var fromRightXCoords = [150, 10, 300];
    // Y coords for spears based on order they are created
    var fromEitherSideYCoords = [0, -10, -20];
    for (var i = 0; i < 3; i++) {
      if (playerX >= 180) {
        var newSpear = this.spears.getFirstExists(false);
        if (!newSpear) {

        newSpear = this.spears.create(this.X_MIN + fromLeftXCoords[i] , playerY + fromEitherSideYCoords[i], 'spear');
        }
        newSpear.reset(this.X_MIN + fromLeftXCoords[i] , playerY + fromEitherSideYCoords[i]);
        newSpear.body.velocity.x = this.SPEAR_SPEED;
        newSpear.body.allowGravity = false;
        newSpear.scale.setTo(1,1);
        newSpear.fromLeft = true;
        newSpear.fromRight = false;
      } else {
        var newSpear = this.spears.getFirstExists(false);
        if (!newSpear) {
        newSpear = this.spears.create(this.X_MAX + fromRightXCoords[i] , playerY + fromEitherSideYCoords[i], 'spear');
        }
        newSpear.reset(this.X_MAX + fromRightXCoords[i] , playerY + fromEitherSideYCoords[i]);
        newSpear.scale.setTo(-1,1);
        newSpear.body.velocity.x = -this.SPEAR_SPEED;
        newSpear.body.allowGravity = false;
        newSpear.fromRight = true;
        newSpear.fromLeft = false;
      }
    }

  },

  levelCleared: function() {

    game.state.start('levelOneGameState');
    // game.state.start('levelTwoGameState');
    console.log("goal reached")
  },

  killSpearsOutBounds: function() {
    this.spears.forEach(function(element){

        if(element.x > this.X_MAX + 50 && element.fromLeft || element.x < this.X_MIN - 50 && element.fromRight ) {
          element.kill();
        // may need to alter else if Y statement if player has ability to shoot in multiple Y directions
        } else if (element.y > this.Y_MAX + 50 || element.y < this.Y_MIN - 50) {
          element.kill();
        }

    }, this)
  },

  killSwordsOutBounds: function() {
    // also kills sword if it hits platform
    this.swords.forEach(function(element){
      if(element.x > this.X_MAX + 50 || element.x < this.X_MIN - 50) {
        element.kill();
      } else if (element.y > this.Y_MAX + 50|| element.y < this.Y_MIN - 50) {
        element.kill();
      } else if (this.game.physics.arcade.overlap(element, this.platforms)){
        element.kill();
      }
    }, this)
  },

  createSpike: function() {
    var theSpike = this.spikes.create(200, 970, 'spike')
    theSpike.body.allowGravity = false;
    theSpike.animations.add('raise', [0,0,0,1,1,1,2,2,3,3,3], 6, false);
    theSpike.play('raise');
  },

  flyBlueBird: function() {
     if (this.blueBird.x > this.X_MAX + 50 && this.blueBird.customParams.nextFromAbove) {
       this.blueBird.reset(this.blueBird.x - 1, this.player.y - 200);
       this.blueBird.body.velocity.x = -200;
       this.blueBird.customParams.nextFromAbove = true;

     } else if (this.blueBird.x < this.X_MIN - 50 && this.blueBird.customParams.nextFromAbove) {
     this.blueBird.reset(this.blueBird.x + 1, this.player.y - 200);
     this.blueBird.body.velocity.x = 200;
      this.blueBird.customParams.nextFromAbove = false;

     } else if (this.blueBird.x > this.X_MAX + 50) {
       this.blueBird.reset(this.blueBird.x - 1, this.player.y);
       this.blueBird.body.velocity.x = -200;
       this.blueBird.customParams.nextFromAbove = false;

     } else if (this.blueBird.x < this.X_MIN - 50) {
     this.blueBird.reset(this.blueBird.x + 1, this.player.y);
     this.blueBird.body.velocity.x = 200;
     this.blueBird.customParams.nextFromAbove = true;
     }
  },

  shootFireBalls: function(num) {
    var xVelArray = [-50, 0, 50, 100, 150];
    var yVelArray = [100, 120, 100, 120, 100];
    for (i = 0; i < num; i++){
        var newFireBall = this.fireBalls.getFirstExists(false);
        if (!newFireBall) {
          newFireBall = this.fireBalls.create(this.blueBird.x, this.blueBird.y, 'fireBall');
        }
        newFireBall.reset(this.blueBird.x, this.blueBird.y);
        newFireBall.body.velocity.x =   xVelArray[i];
        newFireBall.body.velocity.y =  yVelArray[i];
        newFireBall.body.allowGravity = false;
        newFireBall.animations.add('burn', [0,0,0,1,1,1,,2,2,2], 12, true);
        newFireBall.scale.setTo(1,1);
        newFireBall.play('burn');
      }
  }


};
