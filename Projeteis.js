class Projeteis {
    constructor(position, velocidade) {
        this.position = position
        this.width = 2;
        this.height = 20;
        this.velocidade = velocidade;

    }
    draw(ctx){
        ctx.fillStyle = "white"; // Cor do projétil
        ctx.fillRect(

            this.position.x, 
            this.position.y, 
            this.width,
            this.height

        ); // Desenha o projétil
    }
    update(){
        this.position.y +=this.velocidade; 

    }
}

export default Projeteis;