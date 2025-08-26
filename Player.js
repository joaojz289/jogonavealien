import { PATH_NAVE_IMAGEM } from "../utils/constants.js";
import Projeteis from "./Projeteis.js";

class Player {
    constructor(canvasWidth, canvasHeight) { // Construtor da classe Player
        this.alive= true
        this.width = 100;
        this.height = 100;
        this.velocidade = 6;

        this.position = {  // Posição inicial do player
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        this.Imagem = this.getImage(PATH_NAVE_IMAGEM); // Carrega a imagem do player
    }

    getImage(path) { // Método para carregar a imagem do player
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

    draw(ctx) { // Método para desenhar o player no canvas
        ctx.drawImage(this.Imagem, this.position.x, this.position.y, this.width, this.height);
    }

    shoot(projectiles) { // Método para atirar projéteis
        const p = new Projeteis(
            {
                x: this.position.x + this.width / 2,
                y: this.position.y - 5,
            },
            -10
        );
        projectiles.push(p);
    }

    hit(projectile) {
    return (
        projectile.position.x >= this.position.x +20 &&
        projectile.position.x <= this.position.x +20+ this.width -5 &&
        projectile.position.y >= this.position.y+22 &&
        projectile.position.y <= this.position.y+22+ this.height+3
    );
}

}
    
export default Player;
