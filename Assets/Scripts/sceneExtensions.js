// audio constants
const defaultSoundEffectsVolume = 0.02;
const defaultMusicVolume = 0.3;
const defaultMasterVolume = 1;

// audio variables
let textAudio; //audio used when text is displayed
let music; // music of the game
let musicVolume = defaultMusicVolume * defaultMasterVolume;
let masterVolume = defaultMasterVolume;
let soundEffectsVolume = defaultSoundEffectsVolume * defaultMasterVolume;

// UI
let conversationManager;
let fpsText;

// also used by player class
let cursors;
let zKey; // key to talk/interact with the menus
let xKey;

let currentScene; // holds teh current scene
let camera;

// Base scene add cursor controls and text UI
class baseScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'null'
    })
  }

  loadUI() {
    this.load.image('PC_portrait', 'Assets/Sprites/Characters/player/pc_portrait.png');
    this.load.image('textBox', 'Assets/UI/Textboxes/textBox.png');
    this.load.audio('talk', 'Assets/Audio/8Bit Retro Game SFX Pack - 96kHz 24Bit/01Contemporary/Menu/8BitRetroSFXPack1_Contemporary_Menu03.wav');
  }

  createUI() {
    //click for fullscreen
    this.input.on('pointerdown', () => {
      this.game.scale.startFullscreen();
    });

    // gets the current scene
    currentScene = this;

    // FPS text
    fpsText = this.add.text(16, 8, 'FPS: ', {
      fontSize: '16px',
      fontFamily: 'c64esque',
      color: '#FFF'
    }).setScrollFactor(0);

    // text interface of game
    textAudio = this.sound.add('talk');
    zKey = this.input.keyboard.addKey('z');
    xKey = this.input.keyboard.addKey('x');
    cursors = this.input.keyboard.createCursorKeys();

    conversationManager = new DialogueScript(new DialogueManager(this.add.image(98, 150, 'PC'), this.add.image(256, 240, 'textBox'), this.add.text(100, 205, '', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6,
    }), this.add.text(57, 205, '', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#00FFFF',
      align: 'center'
    }), this.add.text(365, 260, '[Z]', {
      fontSize: '32px',
      fontFamily: 'c64esque',
      color: '#FFF',
      lineSpacing: 6
    }), textAudio, soundEffectsVolume), zKey, cursors.down);
  }

  updateUI() {
    fpsText.setText('FPS: ' + Phaser.Math.RoundTo(game.loop.actualFps, 0)); // FPS
  }
}