export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.score = 0;
    this.shapesCollect = {
      "triangulo": {puntos: 10 },
      "cuadrado": {puntos: 20 },
      "rombo": {puntos: 30 },
    }; //le asigna puntaje a cada forma
  }

  preload() {
    //import Cielo
    this.load.image("cielo", "./public/assets/Cielo.webp");
    //import plataforma
    this.load.image("plataforma", "./public/assets/platform.png");
    //import personaje
    this.load.image("personaje", "./public/assets/Ninja.png");
    // importar recolectable
    this.load.image("triangulo", "./public/assets/triangle.png");
    this.load.image("cuadrado", "./public/assets/square.png");
    this.load.image("rombo", "./public/assets/diamond.png");
  }

  create() {
    // crear elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    // crear grupa plataformas
    this.plataformas = this.physics.add.staticGroup();
    // al grupo de plataformas agregar una plataforma
    this.plataformas.create(400, 568, "plataforma").setScale(2).refreshBody();
    // agregamos otra plataforma en otro lugar
    this.plataformas.create(200, 400, "plataforma");

    // crear grupo recolectables
    this.recolectables = this.physics.add.group();

    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);
    //agregar colision entre recolectables y plataforma
    this.physics.add.collider(this.recolectables, this.plataformas, this.reduce, null, this);
    //agregar colision entre recolectables y personaje
    this.physics.add.collider(this.recolectables, this.personaje, this.scoring, null, this);

    //crear teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //texto puntaje
    this.scoreText = this.add.text(16, 16, " SCORE: 0 ", {
      fontSize: "16px",
      fill: "#E0CDF8",
      fontFamily: "Verdana",
    });

    // evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  onSecond() {
    // crear recolectable
    const tipos = ["triangulo", "cuadrado", "rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }

  reduce(shape, platform) {
    shape.disableBody(true,true);
  }

  scoring(character, shape) {
    shape.disableBody(true,true); //desaparece la figura
    const shapeName = shape.texture.key; //detectar el nombre de la figura recolectada
    const scoreNow = this.shapesCollect[shapeName].puntos //detectar los puntos de la figura recolectada y lo convierte en la puntuación q se suma
    this.score += scoreNow; //va acumulando los puntos 
    console.log(this.score)

    this.scoreText.setText(" SCORE: " + this.score );
    if(this.score >= 100) {
      console.log("ganaste")
      this.score = 0;
    }
  }
  
  update() {
    // movimiento personaje
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330);
    }
  }
}