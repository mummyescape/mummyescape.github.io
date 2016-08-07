var gameOver = {
  init: function(currentLevel) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.world.setBounds(0,0,360,592);
    this.game.stage.backgroundColor = '#ff2727'
  },

  preload: function() {
    this.load.spritesheet('bigAntHead', 'assets/images/bigAntHead.png', 270, 270, 6, 0, 0);
    this.load.audio('gameOverSong', ['assets/sounds/gameOverSong.ogg', 'assets/sounds/gameOverSong.mp3']);
  },

  create: function() {
    this.bigAntHead = this.add.sprite(360 / 2, 592/ 2.5 , 'bigAntHead');
    this.bigAntHead.anchor.setTo(0.5);
    this.bigAntHead.animations.add('biting', [0,1,2,3,4,5], 6, true);
    this.bigAntHead.play('biting');
    this.gameOverSong = this.add.audio('gameOverSong');
    this.gameOverSong.loop = true;
    this.gameOverSong.play();

    var style = {
      font: 'bold 10pt Arial',
      fill: '#000',
      align: 'center'
    }

    var styleB = {
      font: 'bold 35pt Arial',
      fill: '#000',
      align: 'center'
    }
    var textData = [
      { text: 'GAME OVER'},
      { text: ""},
      { text: '\nInterested in sponsoring new enemies, levels or tracks? \ncontact: mummyescape@gmail.com'},
      { text: '\nPress T to return to the Title Screen'},
      { text: '\nA Zuhler Production 2016'}
    ];

    var yPercents = [0.15, 0.50, 0.65, 0.75, 0.85];
    /// text
    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[0], '', styleB);
    this.contentText.anchor.setTo(0.5);
    this.contentText.setText(textData[0].text);
    this.contentText.visible = true;

    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[1], '', style);
    this.contentText.anchor.setTo(0.5);
    this.contentText.setText(textData[1].text);
    this.contentText.visible = true;

    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[2], '', style);
    this.contentText.anchor.setTo(0.5);
    this.contentText.setText(textData[2].text);
    this.contentText.visible = true;

    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[3], '', style);
    this.contentText.anchor.setTo(0.5);
    this.contentText.setText(textData[3].text);
    this.contentText.visible = true;

    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[4], '', style);
    this.contentText.anchor.setTo(0.5);
    this.contentText.setText(textData[4].text);
    this.contentText.visible = true;

    /// start key

    this.titleKey = game.input.keyboard.addKey(Phaser.Keyboard.T);


  },

  update: function() {
    if (this.titleKey.isDown) {
      game.state.start('titleState');
    }
  },


}
