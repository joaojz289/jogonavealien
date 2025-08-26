import Alien from "./alien.js";

class Grid{
   constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.AlienVelocidade= 1;
        this.alien = this.init(); // Inicializa a grade de aliens
        this.direction = "right"; // Direção inicial dos aliens
        this.moveDown = false; // Flag para mover os aliens para baixo
    }

    init(){
      const array = []

      for(let row = 0; row < this.rows; row+=1){
      
        for(let col = 0; col < this.cols; col+=1){
            const alien = new Alien(
                {
                x: col * 30 + 20 + col* 81 * 0.3, // Calcula a posição x do alien
                y: row *37+20,
              }
            , this.AlienVelocidade
            );
            array.push(alien);
        }
      }
        return array;
    }
    draw(ctx){
        this.alien.forEach((alien) => {alien.draw(ctx); }); // Desenha cada alien na grade
    }

    update(playerStatus) {

    const chegouNaBordaDireita = this.alien.some(alien => alien.position.x + alien.width >= window.innerWidth);
    const chegouNaBordaEsquerda = this.alien.some(alien => alien.position.x <= 0);

    if (chegouNaBordaDireita) {
        this.direction = "left";
        this.moveDown = true;
    } else if (chegouNaBordaEsquerda) {
        this.direction = "right";
        this.moveDown = true;
    }

    if (!playerStatus) this.moveDown= false;

    this.alien.forEach(alien => {
        if (this.moveDown) {
            alien.moveDown();
            alien.incrementoDeVelocidade(0.2);
            this.AlienVelocidade = alien.velocidade;
        }

        if (this.direction === "right") alien.moveRight();
        if (this.direction === "left") alien.moveLeft();
    });

    this.moveDown = false;
}

 getRandomAlien(){

   const index = Math.floor(Math.random()* this.alien.length);
   return this.alien [index];


 }

 restart() {
  this.alien = this.init();
  this.direction = "right";  // Corrigido o erro de digitação
  this.AlienVelocidade = 1;  // Resetar velocidade inicial
  this.moveDown = false;     // Resetar flag para mover para baixo
}

}

export default Grid;