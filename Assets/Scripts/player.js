// variables needed for player
//constants
const MAX_VELOCITY_X = 120;
const MAX_VELOCITY_Y = 200;
const tolerance = 4;

// variables

// Player class
class Player {
  // public variables
  sprite; // main sprite
  followbox; // the box camera box follows
  custom_id; // custom tag for later use
  cameraBox; // the box the camera follows

  // private variables
  #jumpSpeed = 260; // acceleration for jumping
  #speed = 200; // acceleration for running
  #canJump = false; // if the player can jump
  #distance; // distance between camera objects
  #jumpBoost = 170; // the velocity you get when jumping

  // public functions 
  constructor(sprite, box1, box2) {
    // health to be added
    this.followbox = box1;
    this.cameraBox = box2;
    this.sprite = sprite;
    this.custom_id = 'player';
    this.jumping = false;
    this.sprite.body.setBounce(0.1, 0.1)
      .setCollideWorldBounds(true)
      .setDrag(200, 20)
      .setMaxVelocityX(MAX_VELOCITY_X)
      //.setMaxVelocityY(MAX_VELOCITY_Y)
      .setCircle(8, 18)
      .setOffset(0, 8);
  }

  updatePlayer() {
    // if conversation is taking place no moving
    if (conversationManager.isActive) {
      this.sprite.setVelocity(0);
      this.sprite.setAcceleration(0);
      this.cameraBox.body.setVelocity(0);
      this.#canJump = false;
      return;
    }

    if (cursors.left.isDown) { // move left
      this.sprite.setAccelerationX(-this.#speed);
      this.sprite.flipX = true;
    }
    else if (cursors.right.isDown) { // move right
      this.sprite.body.setAccelerationX(this.#speed);
      this.sprite.flipX = false;
    }
    else {
      this.sprite.body.setAccelerationX(0);
    }

    // jump
    if (zKey.isDown) {
      if (this.sprite.body.touching.down && this.#canJump === true) {
        this.sprite.setAccelerationY(-this.#jumpSpeed);
        this.sprite.setVelocityY(-this.#jumpBoost);
        this.#canJump = false;
      }
    }
    else {
      this.sprite.setAccelerationY(0);
      if (this.sprite.body.touching.down) {
        this.#canJump = true;
      }

    }

    // camera box
    if (this.sprite.flipX === true) {
      this.followbox.x = this.sprite.x - 80;
    }
    else {
      this.followbox.x = this.sprite.x + 80;
    }

    this.followbox.y = this.sprite.y;
    this.cameraBox.y = this.sprite.y;

    this.#distance = Phaser.Math.Distance.BetweenPoints(this.followbox, this.cameraBox);

    if (this.#distance < tolerance) {
      if (this.cameraBox.body.speed > 0) {
        this.cameraBox.body.reset(this.followbox.x, this.followbox.y);
      }
      this.cameraBox.x = this.followbox.x
    }
    else {
      currentScene.physics.moveToObject(this.cameraBox, this.followbox, 150);
    }

  }

  // private functions
}