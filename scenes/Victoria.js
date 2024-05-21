export default class Victoria extends Phaser.Scene {
    constructor() {
      super("victoria");
    }

    init(data){
        this.puntuacion = data.puntuacion;
    }

    create(){
        this.add.text(350, 300, "¡GANASTE!")
        this.add.text(350, 320, "Puntuación: " + this.puntuacion)
    }
  }