const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//ширина поля игры
canvas.width = 1024
canvas.height = 576

//2:14 граница
const barrierMap = []
for (let i = 0; i < barrier.length; i += 70) {
    barrierMap.push(barrier.slice(i, 70 + i))
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
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset = { //расположение персонажа
    x: -557,
    y: -520
}

barrierMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
    })
})

//изображение карты
const image = new Image()
image.src ="./Img/map350.png" //изображение карты


const playerImage = new Image()
playerImage.src = './Img/playerDown.png' // изображение персонажа

class Sprite {
    constructor({position, velocity, image, frames = { max: 1 } }) {
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max //создание границ для барьера
            this.height = this.image.height
        }
    }

    draw() {
         //позиционирование карты и игрока
        c.drawImage(
            this.image,
            0, //обрезка изображения персонажа
            0, 
            this.image.width / this.frames.max, 
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, 
            this.image.height
        )
    }
}
//размещение персонажа на карте (canvans)
const player = new Sprite({
    position: {
        x: canvas.width / 2, //2:49
        y: canvas.height / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})
//перемещение персонажа
const keys = {
    w: {
        prassed: false
    },
    a: {
        prassed: false
    },
    s: {
        prassed: false
    },
    d: {
        prassed: false
    }
}
//позиционирование границы

function rectangularBarrier ({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + player.width >= rectangle2.position.x && // отображение созданых границ для барьера
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + player.height >= rectangle2.position.y)


}

const movables = [background, ...boundaries]
function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw() //отображение границы

    })
    player.draw()

    let moving = true
    if (keys.w.prassed && lastKey === 'w') {
        for (let i = 0; i <  boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularBarrier ({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary, 
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 3
                        }
                    }
                })
            ) {
                console.log('collading')
            moving = false
                break
            }
        }
        if(moving)

            movables.forEach(movable => {// movables отрожает что если персонаж перемещается то граница остается
                movable.position.y += 3
            })
    }
    else if (keys.a.prassed && lastKey === 'a') {
        movables.forEach(movable => {
            movable.position.x += 3
        })
    }
    else if (keys.s.prassed && lastKey === 's') {
        movables.forEach(movable => {
            movable.position.y -= 3
        })
    }
    else if (keys.d.prassed && lastKey === 'd') {
        movables.forEach(movable => {
            movable.position.x -= 3
        })
    }

}
animate()

let lastKey = ''

//перемещеие персонажа
window.addEventListener('keydown', (e) => {
    console.log(e.key)
    switch (e.key){
        case 'w':
            keys.w.prassed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.prassed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.prassed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.prassed = true
            lastKey = 'd'
            break
    }
    console.log(keys)
})

window.addEventListener('keyup', (e) => {
    console.log(e.key)
    switch (e.key){
        case 'w':
            keys.w.prassed = false
            break
        case 'a':
            keys.a.prassed = false
            break
        case 's':
            keys.s.prassed = false
            break
        case 'd':
            keys.d.prassed = false
            break
    }
    console.log(keys)
})
