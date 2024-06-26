import Phaser from 'phaser';
import kid from './assets/r_000.png';
import background from './assets/background.png';
import clouds from './assets/clouds.png';
import mountains1 from './assets/mountains1.png';
import mountains2 from './assets/mountains2.png';
import grass from './assets/grass.png';

class Example extends Phaser.Scene {
  preload () {
    this.load.image('kid', kid);      
    this.load.audio('growl', 'https://labs.phaser.io/assets/audio/monsters/growl1.mp3');
    this.load.image('background', background);
    this.load.image('clouds', clouds);
    this.load.image('mountains1', mountains1);
    this.load.image('mountains2', mountains2);
    this.load.image('grass', grass);
  }

  create () {
    this.gameStarted = false;
    this.gameCompleted = false;

    // prepare scene
    this.add.image(400, 300, 'background');
    this.add.image(0, 20, 'clouds');
    this.add.image(800, 20, 'clouds');
    this.add.image(300, 20, 'clouds');
    this.add.image(500, 20, 'clouds');
    this.add.image(400, 300, 'mountains1');
    this.add.image(400, 500, 'mountains2');

    // add a few alphabets
    const A = this.add.text(200, 450,  'A', { fill: 'grey', fontSize: '50px' });
    const B = this.add.text(350, 400,  'B', { fill: 'grey', fontSize: '50px' });
    const C = this.add.text(500, 450,  'C', { fill: 'grey', fontSize: '50px' });
    const D = this.add.text(650, 400,  'D', { fill: 'grey', fontSize: '50px' });

    // put all above alphabets in an array
    const alphabets = [A, B, C, D];

    this.grass = this.add.tileSprite(0, 600, 1600, 100, 'grass');

    this.kid = this.physics.add.image(30, 400, 'kid');
    this.kid.scale = 0.3;
    this.kid.setCollideWorldBounds(true);
    this.kid.setBounce(0.1);
    this.kid.setVelocity(0, 0);
    this.kid.setGravityY(100);

    this.physics.world.setBounds(0, 0, 800, 555);
    this.kid.setDepth(1);

    // enable overlap for kid
    this.kid.body.onOverlap = true;
    this.kid.body.onWorldBounds = true;

    function jump () {
      this.kid.setVelocityY(-300);
    }

    this.input.on('pointerdown', jump, this);
    this.input.keyboard.on('keydown-SPACE', jump, this);

    // use worldbounds event to reset the kid's velocity when it hits the world bounds
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
      if (body.gameObject === this.kid && (right || left) && this.gameCompleted === false) {
        this.kid.setX(20);
        this.kid.setVelocityX(50);
      }
    });

    this.alphabets = this.physics.add.staticGroup(alphabets);

    this.physics.add.overlap(this.kid, alphabets, (kid, alphabet) => {
      alphabet.setFill('#2ecc71');
      this.sound.play('growl');
    });
  
    this.physics.world.on('overlap', (gameObject1, gameObject2, body1, body2) => {
      let complete = true;

      // run the checkComplete function to see if the game should end with congratulations message
      alphabets.forEach((alphabet) => {
        if (alphabet.style.color !== '#2ecc71') {
          complete = false;
        }
      })
      if (complete) {
        this.add.text(160, 150,  '✅ Congratulations', { fontSize: '50px', color: '#2ecc71'});
        this.gameCompleted = true;
      }
    });

    // create a tap to play button that disables the game until pressed when game starts
    const createTapToPlayButton = () => {
      const rectangle = this.add.rectangle(400, 300, 800, 600, '#000', 0.6);
      const tapToPlayButton = this.add.text(250, 450, 'Tap to play', { fontSize: '50px' });
      tapToPlayButton.setInteractive();
      tapToPlayButton.on('pointerdown', () => {
        tapToPlayButton.destroy();
        rectangle.destroy();
        this.gameStarted = true;

        this.kid.setVelocityX(50);
      });
    }

    createTapToPlayButton();
  }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    }
};

const game = new Phaser.Game(config);
