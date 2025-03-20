//3:07
class Sprite {
    constructor({position, velocity, image, frames = { max: 1 }, sprites }) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0} //анимация перемещения

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max //создание границ для барьера
            this.height = this.image.height
        }
        this.moving = false //анимация перемещения если не нажимаем
        this.sprites = sprites
    }

    draw() {
         //позиционирование карты и игрока
        c.drawImage(
            this.image,
            this.frames.val * this.width, //обрезка изображения персонажа
            0, 
            this.image.width / this.frames.max, 
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, 
            this.image.height
        )
        //анимация перемещения если не нажимаем
        if (!this.moving) return
        if(this.frames.max > 1) {
            this.frames.elapsed++
        }

        //анимация перемещения если нажимаем
        if(this.frames.elapsed % 10 === 0){
            if(this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }

    }
}

//блоки 12х12 когда приближаем карту, как тут на 350% умнажаем на 3,5 = 42
class Boundary {
    static width = 42
    static height = 42
    constructor({position}) {
        this.position = position
        this.width = 42
        this.height = 42
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.17)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}