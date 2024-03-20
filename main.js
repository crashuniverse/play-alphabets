import Phaser from 'phaser';

class Example extends Phaser.Scene {
  preload () {
    this.load.image('sky', 'https://labs.phaser.io/assets/skies/space4.png');      
    this.load.image('car', 'https://labs.phaser.io/assets/sprites/car90.png');      
    this.load.audio('growl', 'https://labs.phaser.io/assets/audio/monsters/growl1.ogg');
  }

  create () {
    this.gameStarted = false;
    // add background
    this.add.image(400, 300, 'sky');

    // add a few alphabets
    const A = this.add.text(200, 100,  'A', { fill: 'grey', fontSize: '50px' });
    const B = this.add.text(300, 200,  'B', { fill: 'grey', fontSize: '50px' });
    const C = this.add.text(500, 300,  'C', { fill: 'grey', fontSize: '50px' });
    const D = this.add.text(600, 400,  'D', { fill: 'grey', fontSize: '50px' });

    // put all above alphabets in an array
    this.alphabets = [A, B, C, D];

    // add image of a car in scene
    this.car = this.add.image(50, 50, 'car');

    const checkProxmity = () => {
      this.alphabets.forEach((alphabet) => {
        if (Math.abs(this.car.x - alphabet.x) < 30 && Math.abs(this.car.y - alphabet.y) < 30) {
          alphabet.setFill('#2ecc71');
          this.sound.play('growl');
        }
      })
    }

    const checkComplete = () => {
      let complete = true;
      this.alphabets.forEach((alphabet) => {
        if (alphabet.style.color !== '#2ecc71') {
          complete = false;
        }
      })
      if (complete) {
        console.log('You have completed the game');
        this.add.text(100, 480,  '✅ Congratulations', { fontSize: '50px' });
      }
    }

    const moveCarX = () => {
      this.car.rotation = 0;
      this.car.x += 10;
      checkProxmity();
      checkComplete();
    }

    const moveCarXm = () => {
      this.car.rotation = Math.PI;
      this.car.x -= 10;
      checkProxmity();
      checkComplete();
    }

    const moveCarY = () => {
      this.car.rotation = Math.PI / 2;
      this.car.y += 10;
      checkProxmity();
      checkComplete();
    }

    const moveCarYm = () => {
      this.car.rotation = 3 * Math.PI / 2;
      this.car.y -= 10;
      checkProxmity();
      checkComplete();
    }

    // get input from keyboard and log something in console
    this.input.keyboard.on('keydown', (event) => {
      if (!this.gameStarted) return;
      if (event.code === 'ArrowRight') {
        moveCarX();
      } else if (event.code === 'ArrowDown') {
        moveCarY();
      } if (event.code === 'ArrowLeft') {
        moveCarXm();
      } else if (event.code === 'ArrowUp') {
        moveCarYm();
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
