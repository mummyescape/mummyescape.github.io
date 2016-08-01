var titleState = {
  init: function(currentLevel) {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.game.world.setBounds(0,0,360,592);
  },



  preload: function() {
    this.load.image('titlePage', 'assets/images/titlePage.png');
  },

  create: function() {
    this.titlePage = this.add.sprite(0 ,0 , 'titlePage');

    var style = {
      font: 'bold 10pt Arial',
      fill: '#000',
      align: 'center'
    }
    var textData = [
      { text: 'Use the cursor keys to move the mummy: \n (Left, Right and Jump)'},
      { text: "Shoot knives from the mummy's chest with: \n (W, A and D)"},
      { text: 'Help the mummy to escape!'},
      { text: 'Press S to begin'},
      { text: 'A BuhlerZ Production'}
    ];

    var yPercents = [0.65, 0.75, 0.79, 0.85, 0.95];
    /// text
    this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercents[0], '', style);
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

    this.startKey = game.input.keyboard.addKey(Phaser.Keyboard.S);


    //
    // for (var i = 0; i < 4; i++) {
    //
    //   this.showText(textData[i], yPercents[i]);
    // }

  },

  update: function() {
    if (this.startKey.isDown) {
      game.state.start('levelOneGameState');
    }
  },

  // showText: function(content, yPercent) {
  //
  //   if(!this.contentText) {
  //     var style = {
  //       font: 'bold 16pt Arial',
  //       fill: '#000',
  //       align: 'center'
  //     }
  //     this.contentText = this.game.add.text(this.game.width/2, this.game.height * yPercent, '', style);
  //     this.contentText.anchor.setTo(0.5);
  //   }
  //
  //   this.contentText.setText(content.text);
  //   this.contentText.visible = true;
  // }


}
