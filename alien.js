import { PATH_ALIEN_IMAGEM } from "../utils/constants.js";
import Projeteis from "./Projeteis.js";

class Alien {
    constructor(position,velocidade) { 
        this.position = position
        this.width = 61 *0.8;
        this.height =48 *0.8;
        this.velocidade = velocidade;


        this.Imagem = this.getImage(PATH_ALIEN_IMAGEM); 
        
    }

    getImage(path) { 
        const image = new Image();
        image.src = path;
        return image;
    }

    moveLeft() { // Método para mover o player para a esquerda
        this.position.x -= this.velocidade;
    }

    moveRight() {
        this.position.x += this.velocidade;
    }

    moveDown(){
    this.position.y += 10; 
}

    incrementoDeVelocidade(boost){
        this.velocidade += boost;
    }


    draw(ctx) {

        ctx.drawImage(
            this.Imagem,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

    }

    shoot(projéteis) { // Método para atirar projéteis
        const p = new Projeteis(
            {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height + 5,

            },
            10
        );
        projéteis.push(p);
    }
    

   
hit(projectile) {
    return (
        projectile.position.x >= this.position.x &&
        projectile.position.x <= this.position.x + this.width &&
        projectile.position.y >= this.position.y &&
        projectile.position.y <= this.position.y + this.height
    );
}

}

export default Alien;