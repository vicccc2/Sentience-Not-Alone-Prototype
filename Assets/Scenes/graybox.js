// grey box scene
class graybox extends baseScene {
  constructor() {
    super({
      key: 'graybox'
    });
  }

  platforms;
  player;
  playerZone_2;
  playerZone_3;
  camera;
  john = new Actor('John', 'john', '#52965d');
  johnSprite;
  june = new Actor('June', 'june', '#c6e6c1');
  juneSprite;

  preload = function() {
    this.load.image('PC', 'Assets/Sprites/Characters/player/pc.png');
    this.load.image('juneSprite', 'Assets/Sprites/Characters/june/june.png');
    this.load.image('johnSprite', 'Assets/Sprites/Characters/john/john.png');
    this.load.image('john', 'Assets/Sprites/Characters/john/john_portrait.png');
    this.load.image('june', 'Assets/Sprites/Characters/june/june_portrait.png');
    // background
    this.load.image('appleCity1', 'Assets/Sprites/Backgrounds/background/AppleCity1.png');
    this.load.image('appleCity2', 'Assets/Sprites/Backgrounds/background/AppleCity2.png');
    this.load.image('appleCity3', 'Assets/Sprites/Backgrounds/background/AppleCity3.png');
    this.load.image('appleCity4', 'Assets/Sprites/Backgrounds/background/AppleCity4.png');

    // platform
    this.load.image('platform', 'Assets/Sprites/platforms/platform.png');

    this.loadUI();
  }

  create = function() {
    // Background
    this.add.image(256, 144, 'appleCity1').setScrollFactor(0);
    this.add.tileSprite(2500, 144, 5000, 288, 'appleCity2').setScrollFactor(0.3);
    this.add.tileSprite(2500, 144, 5000, 288, 'appleCity3').setScrollFactor(0.5);
    this.add.tileSprite(2500, 144, 5000, 288, 'appleCity4').setScrollFactor(1);

    // characters
    this.juneSprite = this.physics.add.image(530, 171, 'juneSprite');
    this.johnSprite = this.physics.add.image(500, 170, 'johnSprite');
    this.johnSprite.body.setAllowGravity(false);
    this.juneSprite.body.setAllowGravity(false);

    // graybox text
    this.add.text(30, 200, 'MOVE WITH ARROW KEYS', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
    });

    this.add.text(250, 200, 'Z TO JUMP', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
    });

    this.add.text(400, 100, 'CLICK DOWN ARROW TO INTERACT WITH NPCS', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF',
    });

    // zones the camera will follow (acts as a look ahead)

    // player
    this.zone1 = this.add.zone(0, 0, 4, 4);
    this.physics.add.existing(this.zone1, false);
    this.zone1.body.moves = false;

    this.zone2 = this.add.zone(0, 0, 4, 4);
    this.physics.add.existing(this.zone2, false);
    this.zone2.body.moves = true;
    this.zone2.body.setAllowGravity(false);

    this.player = new Player(this.physics.add.sprite(32, 32, 'PC'), this.zone1, this.zone2);

    //platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms = this.physics.add.staticGroup({
      key: 'platform',
      repeat: 10,
      setXY: { x: 32, y: 288, stepX: 320 }
    });
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.floatingPlatform = this.physics.add.staticSprite(512, 200, 'platform');
    this.physics.add.collider(this.player.sprite, this.floatingPlatform);

    // add overlap with NPCS
    this.physics.add.overlap(this.player.sprite, this.johnSprite, function(player, john) {
      if (player.body.touching.down === true) {
        conversationManager.listen(1);
      }
    });

    this.physics.add.overlap(this.player.sprite, this.juneSprite, function(player, june) {
      if (player.body.touching.down === true) {
        conversationManager.listen(2);
      }
    });

    // camera   
    camera = this.cameras.main;
    camera.startFollow(this.player.cameraBox, true, 0.2, 0.2, 0, 0);
    this.cameras.main.setBounds(0, 0, 5000, 288);
    this.physics.world.setBounds(0, 0, 5000, 288);

    this.createUI();

    // conversations
    conversationManager.newConversation(/*Conversation 1*/new Conversation([/*Actors*/this.john, this.june], ['just testing this out with a lot of text to fill up the box', "I'm here too."]));
    conversationManager.newConversation(new Conversation([this.june, this.june], ['hello', 'this is a test']));
  }

  update = function() {
    this.player.updatePlayer();
    this.updateUI();

    if (this.player.sprite.x < this.juneSprite.x) {
      this.juneSprite.flipX = true;
    }
    else {
      this.juneSprite.flipX = false;
    }
  }
}